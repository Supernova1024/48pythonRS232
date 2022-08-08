//Including Mongoose model...
const mongoose = require('mongoose');
//creating object 
const Schema = mongoose.Schema;

//Schema for printtarget
const printtargetsSchema = new Schema({

    barcodeid       : {type: String, required: true },
    settype         : {type: String, required: true },
    setstoprint     : {type: String, required: true },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }

});

module.exports=mongoose.model('Printtargets',printtargetsSchema);