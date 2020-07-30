const express = require('express');
const bodyParser = require('body-parser');

const contactlistRouter = express.Router();

contactlistRouter.use(bodyParser.json());

contactlistRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req, res) => {
    res.end('Will send all the contact lists to you');
})
.post((req, res) => {
    res.end(`Will add the following contact list: ${req.body.title} 
        with the following description: ${req.body.description} and 
        date: ${req.body.date}.`);
})
.put((req, res) => {
    res.statusCode = 403; // forbidden
    res.end('PUT operation not supported on /contactlists');
})
.delete((req, res) => {
    res.end('Deleting all contact lists');
});

module.exports = contactlistRouter;