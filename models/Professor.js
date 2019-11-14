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

// Creates Professor Schema
const professorSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, // Trims all trailing whitespaces. 
        default: ''
    },
    lastName: {
        type: String,
        required: true,
        trim: true, // Trims all trailing whitespaces. 
        default: ''
    },
    pid: { //See how to refer _id to this, as this is the Primary key
        type: String,
        default: uuidv4(),
        required: true
    },
    date: {
        type: String,
        default: getDateTime()
    }
});

module.exports = professor = mongoose.model('professor', professorSchema);
