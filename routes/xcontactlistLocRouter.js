const express = require('express');
const bodyParser = require('body-parser');
const Contactlistloc = require('../models/contactlistLoc');

const contactlistLocRouter = express.Router(); // Router() already built into Express

contactlistLocRouter.use(bodyParser.json());  // use method helps us to attach middleware

contactlistLocRouter.route('/')
.get((req, res, next) => { // don't need to pass a next because we will not pass any more fxn
    Contactlistloc.find()
    .then(contactlistlocs => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistlocs);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {  // assumes data is in json format
    Contactlistloc.create(req.body)
    .then(contactlistloc => {
        console.log('Contact List Created', req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistloc);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403; // forbidden
    res.end('PUT operation not supported on /contactlists');
})
.delete((req, res, next) => {
    Contactlistloc.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Routing methods for individual contact
contactlistLocRouter.route('/:contactId')
.get((req, res, next) => { 
    Contactlistloc.findById(req.params.contactId)
    .then(contactlistloc => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistloc);
    })
    .catch(err = next(err));
})
.post((req, res) => {  
    res.statusCode = 403;
    res.end(`POST operation not supported on /contacts/${req.params.contactId}`);
})
.put((req, res, next) => {
    Contactlistloc.findByIdAndUpdate(req.params.contactId, {
        $set: req.body
    }, { new: true })
    .then(contactlistloc => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contactlistloc);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Contactlistloc.findByIdAndDelete(req.params.contactId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = contactlistLocRouter;