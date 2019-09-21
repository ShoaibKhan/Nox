const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates records Schema
const recordsSchema = new Schema({
    sid: {
        type: String,
        required: true
    },
    sesid: { // Session ID
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: int, // TBD: Default value?
    },
    timeRating:{
        type: String, // Note: Doing integer calculation on a string?
        required: true
    },
    comment:{
        type: String,
        default: "",
        required: false
    }
    
    
});

module.exports = records = mongoose.model('records', recordsSchema);

