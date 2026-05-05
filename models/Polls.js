const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    id: { type: String, required: true },
    label: { type: String },
    text: { type: String },
    votes: { type: Number, default: 0 },
    voters: { type: [String], default: [] }
}, { _id: false });

const pollSchema = new Schema({
    pollId: { type: String, required: true, unique: true },
    sesid: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, default: 'mc' },
    options: { type: [optionSchema], default: [] },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    expiresAt: { type: Date },
    closed: { type: Boolean, default: false }
});

module.exports = mongoose.model('polls', pollSchema);
