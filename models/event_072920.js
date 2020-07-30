const mongoose = require('mongoose');

const Schema = mongoose.Schema;


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
    contactlistName: {
        type: Boolean,
        required: true,
        default: false
    },
    contactlistLoc: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});


const Event = mongoose.model('Event', eventSchema); // returns a constructor fxn

module.exports = Event;



