const apiRouter = require('express').Router();
const bodyParser = require('body-parser');
const { readFileSync, writeFileSync } = require('fs');

apiRouter.use(bodyParser.json());

const generateId = () => {
    const newId = parseInt(readFileSync('./id.txt', 'utf-8'), 10) + 1;
    writeFileSync('./id.txt', newId);
    return newId;
};

apiRouter.get('/houses', (req, res) => {
    const houses = readFileSync('./fakeDb.json', 'utf-8');
    if (JSON.parse(houses).length === 0) {
        res.status(404).json({
            error:
                'Sorry... There are no houses available at this moment to be displayed!',
        });
    } else {
        res.send(houses);
    }
});

apiRouter.post('/houses', (req, res) => {
    let { price } = req.body.house;
    if (typeof price === 'undefined') {
        res.status(400).json({ error: 'Price field is required' });
        return;
    }
    price = parseInt(price, 10);
    if (Number.isNaN(price) || price <= 0) {
        res.status(400).json({ error: 'Price should be a positive number' });
        return;
    }
    const houses = JSON.parse(readFileSync('./fakeDb.json', 'utf-8'));
    const newHouse = req.body.house;
    const generatedId = generateId();
    newHouse.id = generatedId;
    houses.push(newHouse);
    writeFileSync('./fakeDb.json', JSON.stringify(houses));
    res.send(JSON.stringify(houses[houses.length - 1]));
});
apiRouter.get('/houses/:id', (req, res) => {
    const { id } = req.params;
    const houses = JSON.parse(readFileSync('./fakeDb.json', 'utf-8'));
    const i = houses.findIndex(elem => elem.id === parseInt(id, 10));
    if (i === -1) {
        res.status(404).json({
            error: `Sorry... There is no house that corresponds to the id: ${id} in our database!`,
        });
    } else {
        res.send(JSON.stringify([houses[i]]));
    }
});
apiRouter.delete('/houses/:id', (req, res) => {
    const { id } = req.params;
    const houses = JSON.parse(readFileSync('./fakeDb.json', 'utf-8'));
    const i = houses.findIndex(elem => elem.id === parseInt(id, 10));
    if (i === -1) {
        res.status(404).json({
            error: `Sorry... There is no house that corresponds to the id: ${id} in our database!`,
        });
    } else {
        houses.splice(i, 1);
        writeFileSync('./fakeDb.json', JSON.stringify(houses));
        res.json({
            error: `The house with the id: ${id} has been deleted from out database!`,
        });
    }
});
apiRouter.use('*', (req, res) => {
    res.status(404).end();
});

module.exports = apiRouter;
