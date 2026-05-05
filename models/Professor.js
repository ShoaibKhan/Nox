const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { randomUUID } = require('crypto');

const professorSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: '',
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
    },
    pid: {
        type: String,
        required: true,
        unique: true,
        default: () => randomUUID(),
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('professor', professorSchema);
