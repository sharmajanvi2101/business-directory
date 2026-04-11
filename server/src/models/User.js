import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
      
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 4,
        select: false
    },
    role: {
        type: String,
        enum: ['customer', 'owner', 'subadmin', 'admin'],
        default: 'customer'
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;


