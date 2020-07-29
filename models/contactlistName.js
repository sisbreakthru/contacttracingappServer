const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactNameSchema = new Schema({
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

const contactlistNameSchema = new Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    contactsName: [contactNameSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Contactlistname', contactlistNameSchema);