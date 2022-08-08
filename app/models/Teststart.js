const mongoose = require('mongoose');
     
const Schema  =  mongoose.Schema;

const teststartSchema = new Schema({
    testtime: {
        type: Number
    },
    user_id: {
        type: String, required:true
    },
    testId:{
        type: String, required:true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teststart', teststartSchema);