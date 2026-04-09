import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user's favorite businesses
// @route   GET /api/users/favorites
// @access  Private
const getFavoriteBusinesses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'favorites',
        populate: { path: 'city' }
    });

    if (user) {
        res.status(200).json(user.favorites || []);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Toggle favorite business
// @route   POST /api/users/favorites/:businessId
// @access  Private
const toggleFavoriteBusiness = asyncHandler(async (req, res) => {
    const { businessId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Use includes with string conversion for safety
    const isFavorite = user.favorites.some(id => id.toString() === businessId);

    if (isFavorite) {
        await User.findByIdAndUpdate(userId, {
            $pull: { favorites: businessId }
        });
    } else {
        await User.findByIdAndUpdate(userId, {
            $addToSet: { favorites: businessId }
        });
    }

    res.status(200).json({ 
        message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        isFavorite: !isFavorite 
    });
});

export {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getFavoriteBusinesses,
    toggleFavoriteBusiness
};
