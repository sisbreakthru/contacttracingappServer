const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // email: {
    //     type: String,
    //     validate: {
    //         validator: (v) => {
    //             return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
    //         },
    //         message: props => `${props.value} is not a valid email address! Please fill in a valid email address.`
    //     },
    //     required: [true, 'A valid email address is required']
    // },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);