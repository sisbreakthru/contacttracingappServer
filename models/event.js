const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", 
    "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", 
    "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", 
    "VT", "VA", "WA", "WV", "WI", "WY"];

const contactlistNameSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        validate: {
            validator: (v) => {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Use format: XXX-XXX-XXXX`
        },
        required: [true, 'Contact phone number required']
    },
    mobile: {
        type: Boolean,
        default: true
    },
    exposureTime: {
        type: String,
        required: true,
        enum: ["< 5 min", "5-60 min", "> 1 hr", "unknown"]
    }
}, {
    timestamps: true
});

const contactlistLocSchema = new Schema({
    date: { 
        type: Date,
        required: true,
        default: Date.now
    },
    nameLoc: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        uppercase: true,
        required: true,
        enum: statesArray
    },
    zipcode: {
        type: Number,
        required: true
    },
    phonenumber: {
        type: String,
        validate: {
            validator: (v) => {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Use format: XXX-XXX-XXXX`
        },
        required: [true, 'Contact phone number required']
    },
    exposureTime: {
        type: String,
        required: true,
        enum: ["< 5 min", "5-60 min", "> 1 hr", "unknown"]
    }
})

const eventSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: false
    },
    exposureTime: {
        type: String,
        required: true,
        enum: ["< 5 min", "5-60 min", "> 1 hr", "unknown"]
    },
    contacts:  [contactlistNameSchema],
    contactsLoc: [contactlistLocSchema]
}, {
    timestamps: true
});


const Event = mongoose.model('Event', eventSchema); // returns a constructor fxn

module.exports = Event;
