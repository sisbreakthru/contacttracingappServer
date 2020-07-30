const express = require('express');
const bodyParser = require('body-parser');
const Event = require('../models/event');
const authenticate = require('../authenticate');

const eventRouter = express.Router();

eventRouter.use(bodyParser.json());

// only authenticate POST, PUT and DELETE endpoints
eventRouter.route('/')
.get((req, res, next) => {
    Event.find()
    .then(events => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Event.create(req.body)
    .then(event => {
        console.log('Exposure Event Created', event);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403; // forbidden
    res.end('PUT operation not supported on /events');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Event.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); // response is the number of docs deleted
    })
    .catch(err => next(err));
});

// Routing endpoints for individual event
eventRouter.route('/:eventId')
.get((req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403; //forbidden
    res.end(`POST operation not supported on /events/${req.params.eventId}.`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Event.findByIdAndUpdate(req.params.eventId, {
        $set: req.body
    } , { new: true })
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Event.findByIdAndDelete(req.params.eventId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


eventRouter.route('/:eventId/contacts')
.get((req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(event.contacts);
        } else {
            err = new Error(`Event ${req.params.eventId} not found.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event) {
            event.contacts.push(req.body);
            event.save()  // the save method returns a promise
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Event ${req.params.eventId} not found.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403; // forbidden
    res.end(`PUT operation not supported on /events/${req.params.eventId}/contacts`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event) {
            for (let i = (event.contacts.length-1); i >=0; i--) {
                event.contacts.id(event.contacts[i]._id).remove();
            }
            event.save()  // the save method returns a promise
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event.contacts);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Event ${req.params.eventId} not found.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});


eventRouter.route('/:eventId/contacts/:contactId')
.get((req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event && event.contacts.id(req.params.contactId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(event.contacts.id(req.params.contactId));
        } else if (!event) {
            err = new Error(`Event ${req.params.eventId} not found.`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Contact ${req.params.contactId} not found.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /events/${req.params.eventId}/contacts/${req.params.contactId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event && event.contacts.id(req.params.contactId)) {
            if (req.body.date) {
                event.contacts.id(req.params.contactId).date = req.body.date;
            }
            if (req.body.firstname) {
                event.contacts.id(req.params.contactId).firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                event.contacts.id(req.params.contactId).lastname = req.body.lastname;
            }
            if (req.body.phonenumber) {
                event.contacts.id(req.params.contactId).phonenumber = req.body.phonenumber;
            }
            if (req.body.mobile) {
                event.contacts.id(req.params.contactId).mobile = req.body.mobile;
            }
            if (req.body.exposureTime) {
                event.contacts.id(req.params.contactId).exposureTime = req.body.exposureTime;
            }
            event.save()
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            })
            .catch(err => next(err));
        } else if (!event) {
            err = new Error(`Event ${req.params.eventId} not found.`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Contact ${req.params.contactId} not found.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event && event.contacts.id(req.params.contactId)) {
            event.contacts.id(req.params.contactId).remove();
            event.save()
            .then(event => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            })
            .catch(err => next(err));
        } else if (!event) {
            err = new Error(`Event ${req.params.eventId} not found.`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Contact ${req.params.contactId} not found.`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});


module.exports = eventRouter;


