const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv4 = require('uuid/v4');


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

// Creates Student Schema
const studentSchema = new Schema({
    sid: { // TBD: MAC Address / Device Model / Cookies / Student #
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    currentSesID: {
        type: String,

    }
});

module.exports = student = mongoose.model('student', studentSchema);
