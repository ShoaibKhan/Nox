const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates records Schema
const recordsSchema = new Schema({
    studentId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        default: null, // Would this work? -- Yes, MongoDB can ignore null values in your calculations 
        minimum: 0,
        maximum: 2,
        required: true
    },
    timeRating:{// Dateformat
        required: true,
        type: Date,
        default: Date.now
    },
    comment:{
        type: String,
        default: "",
        required: false
    }
    
    
});

module.exports = records = mongoose.model('records', recordsSchema);

