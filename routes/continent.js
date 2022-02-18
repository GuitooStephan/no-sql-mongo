const express = require('express');

const ContinentModel = require('../models/Continent');
const CountryModel = require('../models/Country');

const router = express.Router();

router.post('/', async (req, res) => {
    const continent = await ContinentModel.create(req.body);
    return res.status(200).json(continent);
});

router.get('/', async (req, res) => {
    const continents = await ContinentModel.find().populate('countries', '-_id -__v -continent');
    return res.status(200).json(continents);
});

// Find Continents with countries number
router.get('/withcountriesnumber/', async ( req, res ) => {
    const continents = await ContinentModel.aggregate([
        {
            $project: {
                name: 1,
                numberOfCountries: { $size: "$countries" }
            }
        }
    ] );
    return res.status(200).json(continents);
});

// Find first four countries of a continent
router.get('/:id/fourfirstcountries', async (req, res) => {
    const countries = await CountryModel.find({ continent: req.params.id },[ 'name', 'isoCode' ], { limit: 4, sort: { name: 1 } });
    return res.status(200).json(countries);
});

router.put('/:id/', async ( req, res ) => {
    const continent = await ContinentModel.findOneAndUpdate({ _id: req.params.id } , req.body, { new: true }).populate('countries', '-_id -__v -continent');
    return res.status(200).json(continent);
});

module.exports = router;
