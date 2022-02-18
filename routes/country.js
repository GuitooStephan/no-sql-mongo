const CountryModel = require('../models/Country');
const ContinentModel = require('../models/Continent');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const country = await CountryModel.create(req.body).then( async country => {
        await ContinentModel.findOneAndUpdate({ _id: country.continent } , { $push: { countries: country._id } }, { new: true })
        return country
    } );
    return res.status(200).json(country);
});

router.get('/', async (req, res) => {
    const countries = await CountryModel.find().populate('continent', '-_id -__v -countries');
    return res.status(200).json(countries);
});

// Get countries by populations
router.get('/bypopulation/', async (req, res) => {
    const countries = await CountryModel.find( {}, [ 'name', 'isoCode', 'population' ], { sort: { population: 1 } } ).populate('continent', '-_id -__v -countries');
    return res.status(200).json(countries);
});

// Get countries with u in their name and more than 30 000 000
router.get('/filternameandpopulation/', async (req, res) => {
    const countries = await CountryModel.find( { name: { $regex: new RegExp(".*u.*", "i") }, population: { $gte: 30000000} }, [ 'name', 'isoCode', 'population' ] ).populate('continent', '-_id -__v -countries');
    return res.status(200).json(countries);
});

// Find the number of countries
router.get('/number/', async (req, res) => {
    const num = await CountryModel.find().count();
    return res.status(200).json({'count': num});
});

router.get('/:id/', async (req, res) => {
    const country = await CountryModel.findById(req.params.id);
    return res.status(200).json(country);
});

router.put('/:id/', async ( req, res ) => {
    const country = await CountryModel.findOneAndUpdate({ _id: req.params.id } , req.body, { new: true }).populate('continent', '-_id -__v -countries');
    return res.status(200).json(country);
});

router.delete('/:id/', async ( req, res ) => {
    await CountryModel.findOneAndDelete({ _id: req.params.id });
    return res.status(204).json({'msg': 'Deleted'});
});

// Find the countries that startwith a letter
router.get('/startwith/:letter', async (req, res) => {
    const countries = await CountryModel.find({ name: { $regex: new RegExp("^"+ req.params.letter, "i") } });
    return res.status(200).json(countries);
});

module.exports = router;
