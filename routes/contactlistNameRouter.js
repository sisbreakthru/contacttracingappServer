const express = require('express');
const bodyParser = require('body-parser');
const Contactlistname = require('../models/contactlistName');

const contactlistNameRouter = express.Router(); // Router() already built into Express

contactlistNameRouter.use(bodyParser.json());  // use method helps us to attach middleware

contactlistNameRouter.route('/:eventId/contactlistnames')
.get((req, res, next) => { 
    Contactlistname.find({ event: req.params.eventId })
    //.populate('event') // not working
    .then(contactlistnames => {
        console.log(contactlistnames);
        if(contactlistnames) {
            console.log(contactlistnames);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(contactlistnames);
        } else {
            console.log("My error message");
            err = new Error(`There is no contact list by names for event id: ${req.params.eventId}.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {  // assumes data is in json format
    Contactlistname.create(req.body)
    .then(contactlistname => {
        console.log('Contact List Created', req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistname);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403; // forbidden
    res.end('PUT operation not supported on /contactlists');
})
.delete((req, res, next) => {
    Contactlistname.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Routing methods for contact list
contactlistNameRouter.route('/:contactlistId')
.get((req, res, next) => { 
    Contactlistname.findById(req.params.contactlistId)
    .then(contactlistname => {
        console.log(contactlistname);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistname);
    })
    .catch(err => next(err));
})
.post((req, res) => {  
    res.statusCode = 403;
    res.end(`POST operation not supported on /contactlistNames/${req.params.contactId}`);
})
.put((req, res, next) => {
    Contactlistname.findByIdAndUpdate(req.params.contactId, {
        $set: req.body
    }, { new: true })
    .then(contactlistname => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistname);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Contactlistname.findByIdAndDelete(req.params.contactId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => new(err));
});


module.exports = contactlistNameRouter;