const apiRouter = require('express').Router();
const bodyParser = require('body-parser');
const db = require('./db');
const { validateHouse, houseForSqlQuery } = require('./validation');

apiRouter.use(bodyParser.json());
const addHousesSql = `insert into houses (
link ,
market_date,
location_country,
location_city ,
location_address,
location_coordinates_lat,
location_coordinates_lng,
size_living_area,
size_rooms,
price_value,
price_currency,
description,
title,
images,
sold
) values ?`;

apiRouter.post('/houses', async (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Data should be an array' });
    }
    const processedData = req.body.map(validateHouse);

    const validData = [];
    const invalidData = [];
    processedData.forEach(elem => {
        if (elem.valid) {
            validData.push(elem);
        } else {
            invalidData.push(elem);
        }
    });
    const report = {
        valid: validData.length,
        invalid: invalidData,
    };
    if (validData.length) {
        try {
            const housesData = validData.map(obj => houseForSqlQuery(obj.raw));
            await db.queryPromise(addHousesSql, [housesData]);
            return res.json(report);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else {
        return res.json(report);
    }
});

apiRouter.use('*', (req, res) => {
    res.status(404).end();
});

module.exports = apiRouter;

//
//
// const apiRouter = require('express').Router();
// const bodyParser = require('body-parser');

// apiRouter.use(bodyParser.json());

// const { readFileSync, writeFileSync } = require('fs');

// const generateId = () => {
//     const newId = parseInt(readFileSync('./id.txt', 'utf-8'), 10) + 1;
//     writeFileSync('./id.txt', newId);
//     return newId;
// };

// apiRouter.get('/houses', (req, res) => {
//     const houses = readFileSync('./fakeDb.json', 'utf-8');
//     if (JSON.parse(houses).length === 0) {
//         res.status(404).json({
//             error:
//                 'Sorry... There are no houses available at this moment to be displayed!',
//         });
//     } else {
//         res.send(houses);
//     }
// });

// apiRouter.post('/houses', (req, res) => {
//     let { price } = req.body;
//     if (typeof price === 'undefined') {
//         res.status(400).json({ error: 'Price field is required' });
//         return;
//     }
//     price = parseInt(price, 10);
//     if (Number.isNaN(price) || price <= 0) {
//         res.status(400).json({ error: 'Price should be a positive number' });
//         return;
//     }
//     const houses = JSON.parse(readFileSync('./fakeDb.json', 'utf-8'));
//     const newHouse = req.body;
//     const generatedId = generateId();
//     newHouse.id = generatedId;
//     houses.push(newHouse);
//     writeFileSync('./fakeDb.json', JSON.stringify(houses));
//     res.send(JSON.stringify(houses[houses.length - 1]));
// });
// apiRouter.get('/houses/:id', (req, res) => {
//     const { id } = req.params;
//     const houses = JSON.parse(readFileSync('./fakeDb.json', 'utf-8'));
//     const i = houses.findIndex(elem => elem.id === parseInt(id, 10));
//     if (i === -1) {
//         res.status(404).json({
//             error: `Sorry... There is no house that corresponds to the id: ${id} in our database!`,
//         });
//     } else {
//         res.send(JSON.stringify([houses[i]]));
//     }
// });
// apiRouter.delete('/houses/:id', (req, res) => {
//     const { id } = req.params;
//     const houses = JSON.parse(readFileSync('./fakeDb.json', 'utf-8'));
//     const i = houses.findIndex(elem => elem.id === parseInt(id, 10));
//     if (i === -1) {
//         res.status(404).json({
//             error: `Sorry... There is no house that corresponds to the id: ${id} in our database!`,
//         });
//     } else {
//         houses.splice(i, 1);
//         writeFileSync('./fakeDb.json', JSON.stringify(houses));
//         res.json({
//             error: `The house with the id: ${id} has been deleted from out database!`,
//         });
//     }
// });
// apiRouter.use('*', (req, res) => {
//     res.status(404).end();
// });

// apiRouter.use('*', (req, res) => {
//     res.status(404).end();
// });

// module.exports = apiRouter;
