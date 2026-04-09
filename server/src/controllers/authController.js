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

    // 1. Check if user already exists in MAIN collection
    const userExists = await User.findOne({
        $or: [{ email }, { phone }]
    });

    if (userExists) {
        res.status(400);
        const field = userExists.email === email ? 'Email' : 'Phone number';
        throw new Error(`${field} is already registered`);
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save to PreUser (temporary storage)
    // We update if already exists to avoid multiple pending registrations for one email
    await PreUser.findOneAndUpdate(
        { email },
        { name, email, phone, password, role, otp },
        { upsert: true, returnDocument: 'after' }
    );

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

    // 1. Find the temporary user data
    const preUser = await PreUser.findOne({ email, otp });

    if (!preUser) {
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
        await PreUser.deleteOne({ email });

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
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(403);
            throw new Error('Please verify your email to login');
        }
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
