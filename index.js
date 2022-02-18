require('dotenv').config();
const express = require('express');

require('./conf/database');

const countryRouter = require('./routes/country');
const continentRouter = require('./routes/continent');

const app = express();
app.use(express.json());
app.use('/countries', countryRouter);
app.use('/continents', continentRouter);

app.listen( 3000, () => {
    console.log("Server running...");
} );

app.get('/status', ( req, res ) => {
    return res.status(200).json({msg: "It works"});
});

