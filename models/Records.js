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
        type: int,
        default: null, // Would this work? -- Yes, MongoDB can ignore null values in your calculations 
        minimum: 0,
        maximum: 10,
    },
    timeRating:{// Dateformat 
        type: String, // Note: Doing integer calculation on a string? -- Put date format. Hard/annoying to deal with type conversions
        required: true
    },
    comment:{
        type: String,
        default: "",
        required: false
    }
    
    
});

module.exports = records = mongoose.model('records', recordsSchema);

