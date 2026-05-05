const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        default: 0,
        minimum: 0,
        maximum: 3,
    },
    old_value: {
        type: Number,
        default: 0,
        minimum: 0,
        maximum: 3,
    },
    timeRating: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
    },
    votes: {
        type: Number,
        default: 0
    },
    answered: {
        type: Boolean,
        default: false
    },
    voters: {
        type: [String],
        default: []
    }
});

module.exports = records = mongoose.model('records', recordsSchema);
