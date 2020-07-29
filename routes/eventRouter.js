const express = require('express');
const bodyParser = require('body-parser');
const Event = require('../models/event');

const eventRouter = express.Router();

eventRouter.use(bodyParser.json());

eventRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res) => {
    res.end('Will send list of exposure event reports to you');
})
.post((req, res) => {
    res.end(`Will add the following exposure event: ${req.body.title}
        with the following description: ${req.body.description} and
        date: ${req.body.date}.`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operations not supported on /events');
})
.delete((req, res) => {
    res.end('Deleting all exposure event reports.');
});

// Routing endpoints for individual event
eventRouter.route('/:eventId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res) => {
    res.end(`Will send details of exposure event: ${req.params.eventId} to you. `);
})
.post((req, res) => {
    res.statusCode = 403; //forbidden
    res.end(`POST operation not supported on /events/${req.params.eventId}.`);
})
.put((req, res) => {
    res.write(`Updating the event: ${req.params.eventId}\n`);
    res.end(`Will update the event with the following
        information: Title: ${req.body.title}; Description: ${req.body.description};
        Additional Info: ${req.body.comments}; Exposure Time: ${req.body.exposureTime}`);
})
.delete((req, res) => {
    res.end(`Deleting event: ${req.params.eventId}`);
})


module.exports = eventRouter;


