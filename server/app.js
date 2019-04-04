const express = require('express');
const path = require('path');
const apiRouter = require('./api');

const app = express();

app.get('*', function logGetRequests(req, res, next) {
    console.log('someone made a request with GET method');
    next();
});

app.use('/api', apiRouter);

app.use(express.static('./../client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './../client/build/index.html'));
});

app.use('*', (req, res) => {
    res.status(404).end();
});

module.exports = app;
