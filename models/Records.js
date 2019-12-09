const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates records Schema
const recordsSchema = new Schema({
    studentID: {
        type: String,
        required: true
    },
    sessionID: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        default: 0, // Would this work? -- Yes, MongoDB can ignore null values in your calculations 
        minimum: 0,
        maximum: 2,

    },
    old_value: {
        type: Number,
        default: 0, // Would this work? -- Yes, MongoDB can ignore null values in your calculations 
        minimum: 0,
        maximum: 2,

    },
    timeRating: {// Dateformat
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,


    }


});

module.exports = records = mongoose.model('records', recordsSchema);

