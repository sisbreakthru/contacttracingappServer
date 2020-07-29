const express = require('express');
const bodyParser = require('body-parser');

const contactlistNameRouter = express.Router(); // Router() already built into Express

contactlistNameRouter.use(bodyParser.json());  // use method helps us to attach middleware

contactlistNameRouter.route('/')
.all((req, res, next) => {  // catch all routing for all http verbs; path is set above
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next(); // passes control to next relevant routing method
}) 
.get((req, res) => { // don't need to pass a next because we will not pass any more fxn
    res.end('Will send all the contacts to you');
})
.post((req, res) => {  // assumes data is in json format
    console.log(req.body);
    res.end(`Will add the contact: ${req.body.firstname} ${req.body.lastname} with the following information: 
        Contact List Title: ${req.body.title}; Phone number: ${req.body.phonenumber}; Mobile: ${req.body.mobile};
        Exposure Time: ${req.body.exposureTime}`);
})
.put((req, res) => {
    res.statusCode = 403; // forbidden
    res.end('PUT operation not supported on /contactlists');
})
.delete((req, res) => {
    res.end('Deleting contact list and all contacts.');
});

// Routing methods for individual contact
contactlistNameRouter.route('/:contactId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res) => { 
    res.end(`Will send details of contact: ${req.params.contactId} to you`);
})
.post((req, res) => {  
    res.statusCode = 403;
    res.end(`POST operation not supported on /contactlistNames/${req.params.contactId}`);
})
.put((req, res) => {
    res.write(`Updating the contact: ${req.params.contactId}\n`);
    res.end(`Will update the contact: ${req.body.firstname} ${req.body.lastname} with 
        the following information: Phone number: ${req.body.phonenumber}; 
        Mobile: ${req.body.mobile}`);
})
.delete((req, res) => {
    res.end(`Deleting contact: ${req.params.contactId}`);
});


module.exports = contactlistNameRouter;