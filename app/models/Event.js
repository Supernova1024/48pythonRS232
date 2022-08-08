//Including Mongoose model...
const mongoose = require('mongoose');
//creating object 
const Schema = mongoose.Schema;

//Schema for event
const eventSchema = new Schema({

    eventname         : {type: String, required: true },
    eventdate         : {type: String, required: true },
    discipline        : {type: String },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Event',eventSchema);