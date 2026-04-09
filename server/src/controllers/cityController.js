import asyncHandler from 'express-async-handler';
import City from '../models/City.js';

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getCities = asyncHandler(async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const cities = await City.find(query);
    res.status(200).json(cities);
});

// @desc    Create a city
// @route   POST /api/cities
// @access  Private/Admin
const createCity = asyncHandler(async (req, res) => {
    const { name, state, country } = req.body;

    const cityExists = await City.findOne({ name });

    if (cityExists) {
        res.status(400);
        throw new Error('City already exists');
    }

    const city = await City.create({ name, state, country });
    res.status(201).json(city);
});

// @desc    Update city
// @route   PUT /api/cities/:id
// @access  Private/Admin
const updateCity = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);

    if (city) {
        city.name = req.body.name || city.name;
        city.state = req.body.state || city.state;
        city.country = req.body.country || city.country;

        const updatedCity = await city.save();
        res.json(updatedCity);
    } else {
        res.status(404);
        throw new Error('City not found');
    }
});

// @desc    Delete city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
const deleteCity = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);

    if (city) {
        await city.deleteOne();
        res.json({ message: 'City removed' });
    } else {
        res.status(404);
        throw new Error('City not found');
    }
});

export {
    getCities,
    createCity,
    updateCity,
    deleteCity
};
