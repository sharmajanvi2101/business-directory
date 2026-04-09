import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    icon: {
        type: String, // SVG or font icon class or image URL
        default: 'default-category'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
