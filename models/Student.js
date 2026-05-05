const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    sid: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    currentSesID: {
        type: String,
    },
});

module.exports = mongoose.model('student', studentSchema);
