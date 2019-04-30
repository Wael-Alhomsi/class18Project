/* eslint-disable camelcase */
const apiRouter = require('express').Router();
const bodyParser = require('body-parser');
const db = require('./db');
const { validateHouse, houseForSqlQuery } = require('./validation');

const HOUSES_PER_PAGE = 4;

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
    const processedHousesData = req.body.map(validateHouse);

    const validHousesData = [];
    const invalidHousesData = [];
    processedHousesData.forEach(house => {
        if (house.valid) {
            validHousesData.push(house);
        } else {
            invalidHousesData.push(house);
        }
    });
    const report = {
        validHousesCount: validHousesData.length,
        invalidHousesArray: invalidHousesData,
    };
    if (validHousesData.length) {
        try {
            const housesData = validHousesData.map(obj =>
                houseForSqlQuery(obj.raw)
            );
            await db.queryPromise(addHousesSql, [housesData]);
            return res.json(report);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else {
        return res.json(report);
    }
});

apiRouter.get('/houses', async (req, res) => {
    let {
        // eslint-disable-next-line prefer-const
        size_rooms = 'all',
        price_min = 0,
        price_max = 1000000,
        // eslint-disable-next-line prefer-const
        location_city = '',
        // eslint-disable-next-line prefer-const
        order = 'location_country_asc',
        page = 1,
    } = req.query;

    if (['all', '1', '2', '3', '4_or_more'].indexOf(size_rooms) === -1) {
        return res.status(400).json({ error: `'size_rooms' param is wrong` });
    }
    price_min = parseInt(price_min, 10);
    if (Number.isNaN(price_min) || price_min < 0) {
        return res
            .status(400)
            .json({ error: `'price_min' should be a positive number` });
    }
    price_max = parseInt(price_max, 10);
    if (Number.isNaN(price_max) || price_max < 0) {
        return res
            .status(400)
            .json({ error: `'price_max' should be a positive number` });
    }
    if (price_max < price_min) {
        return res
            .status(400)
            .json({ error: `'price_max' should be greater than 'price_min'` });
    }
    page = parseInt(page, 10);
    if (Number.isNaN(page) || page <= 0) {
        return res
            .status(400)
            .json({ error: `'page' should be a positive number` });
    }

    let order_field;
    let order_direction;

    const index = order.lastIndexOf('_');
    if (index > 0) {
        order_field = order.slice(0, index);
        order_direction = order.slice(index + 1);
        if (['asc', 'desc'].indexOf(order_direction) === -1) {
            return res.status(400).json({ error: `'order' param is wrong` });
        }
    } else {
        return res.status(400).json({ error: `'order' param is wrong` });
    }

    const offset = (page - 1) * HOUSES_PER_PAGE;

    const conditions = [`(price_value between ? and ?)`];
    const params = [price_min, price_max];

    if (location_city.length) {
        conditions.push(`location_city = ?`);
        params.push(location_city);
    }
    if (size_rooms === '4_or_more') {
        conditions.push('size_rooms >= ?');
        params.push(4);
    } else if (size_rooms !== 'all') {
        conditions.push('size_rooms = ?');
        params.push(size_rooms);
    }

    const queryBody = `from houses
  where ${conditions.join(' and ')}`;

    const queryTotal = `
  select count(id) as total ${queryBody}`;

    const queryItems = `
  select * ${queryBody}
  order by ${db.escapeId(order_field, true)} ${order_direction}
  limit ${HOUSES_PER_PAGE}
  offset ${offset}`;

    try {
        const total = await db.queryPromise(queryTotal, params);
        const houses = await db.queryPromise(queryItems, params);
        return res.json({
            total: total[0].total,
            houses,
            pageSize: HOUSES_PER_PAGE,
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

apiRouter.use('*', (req, res) => {
    res.status(404).end();
});

module.exports = apiRouter;

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
