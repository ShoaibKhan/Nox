const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates Professor Schema
const professorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = professor = mongoose.model('professor', professorSchema);
