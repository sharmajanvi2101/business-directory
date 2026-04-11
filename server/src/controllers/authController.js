import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user already exists
    const userExists = await User.findOne({
        $or: [{ email: normalizedEmail }, { phone }]
    });

    if (userExists) {
        res.status(400);
        const field = userExists.email === normalizedEmail ? 'Email' : 'Phone number';
        throw new Error(`${field} is already registered`);
    }

    // 2. Create the User account directly
    const user = await User.create({
        name,
        email: normalizedEmail,
        phone,
        password,
        role,
        isVerified: true // Default to true as OTP functionality is removed
    });

    if (user) {
        // 3. Send Welcome Email (in background)
        sendEmail({
            email: normalizedEmail,
            subject: 'Welcome to BizDirect',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c; text-align: center;">Welcome to BizDirect, ${name}!</h2>
                    <p>Your account has been successfully created. We are excited to have you on board!</p>
                    <p>You can now login and explore our business directory.</p>
                </div>
            `
        }).catch(err => console.error('❌ Background Welcome Email Error:', err));

        console.log(`✅ Registration complete: ${user.email}`);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login to continue.'
        });
    } else {
        res.status(400);
        throw new Error('Account creation failed');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    console.log('--- Incoming Login Request ---');

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log(`🔍 Attempting login for: [${normalizedEmail}]`);

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (user && (await user.matchPassword(trimmedPassword))) {
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
        user.email = (req.body.email || user.email).toLowerCase();
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
    deleteUserProfile
};
