const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv4 = require('uuid/v4');
const shortid = require('shortid');

//var currentDate = new Date();

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

// Creates Sessions Schema
const sessionsSchema = new Schema({

    sesid: { // Session ID
        type: String,
        required: true
    },
    dateStart: { // Date Session Started
        type: String,
        default: getDateTime() //YYYY:MM:DD:HH:MM
    },
    pid: { // ID of Professor Host
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    }
});

module.exports = sessions = mongoose.model('sessions', sessionsSchema);

