const express = require('express');
const apiRouter = require('./api');

const app = express();

app.get('*', function logGetRequests(req, res, next) {
    console.log('someone made a request with GET method');
    next();
});

app.use(express.static('./../client/build'));

app.use('/api', apiRouter);

app.get('/', function(req, res) {
    res.send('index page, triggered by GET /');
});

module.exports = app;
