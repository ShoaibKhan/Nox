const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionsSchema = new Schema({
    sesid: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    dateStart: {
        type: Date,
        default: Date.now,
    },
    pid: {
        type: String,
        required: true,
        index: true,
    },
    courseCode: {
        type: String,
        required: true,
        index: true,
    },
});

module.exports = mongoose.model('sessions', sessionsSchema);
