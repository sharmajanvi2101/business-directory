import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a city name'],
        unique: true,
        trim: true
    },
    state: {
        type: String,
        required: [true, 'Please add a state name'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Please add a country name'],
        default: 'India'
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
}, {
    timestamps: true
});

const City = mongoose.model('City', citySchema);

export default City;
