import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import PreUser from '../models/PreUser.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Start registration (send OTP)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in MAIN collection
    const userExists = await User.findOne({
        $or: [{ email: normalizedEmail }, { phone }]
    });

    if (userExists) {
        res.status(400);
        const field = userExists.email === normalizedEmail ? 'Email' : 'Phone number';
        throw new Error(`${field} is already registered`);
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save to PreUser (temporary storage)
    await PreUser.findOneAndUpdate(
        { email: normalizedEmail },
        { name, email: normalizedEmail, phone, password, role, otp },
        { upsert: true, returnDocument: 'after' }
    );

    // SAFETY LOG: So you can see the code in Render Logs even if email is slow
    console.log(`🔑 OTP for ${normalizedEmail} is: ${otp}`);

    // 4. Send Email (in background - don't await so the user gets an instant response)
    sendEmail({
        email,
        subject: 'Email Verification - BizDirect',
        message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ea580c; text-align: center;">Welcome to BizDirect</h2>
                <p>Use the following code to verify your email and complete your registration:</p>
                <div style="background: #fff7ed; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `
    }).catch(err => console.error('❌ Background Email Error:', err));

    // 5. Return immediate success
    res.status(200).json({
        success: true,
        message: 'Verification code sent! Please check your email.'
    });
});

// @desc    Verify OTP & Complete Signup
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    console.log(`🔍 Verifying email: ${normalizedEmail} with OTP: ${otp}`);

    // 1. Find the temporary user data
    const preUser = await PreUser.findOne({ email: normalizedEmail, otp });

    if (!preUser) {
        console.log(`❌ Invalid OTP for ${normalizedEmail}`);
        res.status(400);
        throw new Error('Invalid or expired verification code');
    }

    // 2. Create the ACTUAL User account
    const user = await User.create({
        name: preUser.name,
        email: preUser.email,
        phone: preUser.phone,
        password: preUser.password, // This will be hashed by User model pre-save hook
        role: preUser.role,
        isVerified: true
    });

    if (user) {
        // 3. Delete the temporary data
        await PreUser.deleteOne({ email: normalizedEmail });

        // 4. Generate token and log user in automatically
        generateToken(res, user._id);

        console.log(`✅ Registration complete and auto-logged in: ${user.email}`);

        res.status(201).json({
            success: true,
            message: 'Email verified! Account created and logged in.',
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profilePicture: user.profilePicture,
            favorites: user.favorites || []
        });
    } else {
        console.log(`❌ User creation failed for ${normalizedEmail}`);
        res.status(400);
        throw new Error('Account creation failed');
    }
});

// @desc    Resend verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const preUser = await PreUser.findOne({ email });

    if (!preUser) {
        res.status(404);
        throw new Error('No pending registration found for this email');
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    preUser.otp = otp;
    await preUser.save();

    // Send email in background
    sendEmail({
        email,
        subject: 'Email Verification - BizDirect',
        message: `Your new verification code is: ${otp}. It expires in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ea580c; text-align: center;">New Verification Code</h2>
                <p>Use the following code to verify your email address:</p>
                <div style="background: #fff7ed; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `
    }).catch(err => console.error('❌ Background Email Error:', err));

    res.status(200).json({ message: 'Verification code resent successfully' });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    console.log('--- Incoming Login Request ---');

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('❌ Missing email or password in request body');
        res.status(400);
        throw new Error('Email and password are required');
    }

    const trimmedEmail = email.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();
    const trimmedPassword = password.trim();

    console.log(`🔍 Attempting login for: [${normalizedEmail}]`);

    let user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
        // Check if they are stuck in the "PreUser" (unverified) state
        const pendingUser = await PreUser.findOne({ email: normalizedEmail });
        if (pendingUser) {
            res.status(403);
            throw new Error('Your email is not verified. Please complete the verification step first.');
        }

        console.log(`❌ User NOT FOUND using normalized email: ${normalizedEmail}`);
        // Fallback search with original string
        user = await User.findOne({ email: trimmedEmail }).select('+password');
    }

    if (user && (await user.matchPassword(trimmedPassword))) {
        if (!user.isVerified) {
            res.status(403);
            throw new Error('Please verify your email to login');
        }
        
        console.log(`✅ Login successful: ${normalizedEmail}`);
        generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profilePicture: user.profilePicture,
            favorites: user.favorites || []
        });
    } else {
        if (user) {
            console.log(`❌ Invalid password for user: ${normalizedEmail}`);
        }
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        favorites: req.user.favorites || []
    };

    res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profilePicture = req.body.profilePicture || user.profilePicture;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            favorites: updatedUser.favorites || []
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user profile
// @route   DELETE /api/auth/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Admin user cannot be deleted');
        }

        await user.deleteOne();

        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    verifyEmail,
    resendOTP
};
