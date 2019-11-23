const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv4 = require('uuid/v4');
const shortid = require('shortid');


//var currentDate = new Date();
var num = 0; // Need in order to use toString() method
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

function getARandomArbitrary(min, max) { // max = 99 999, min= 10 000
    min = Math.ceil(min);
    max = Math.floor(max);
    console.log(Math.floor(Math.random() * (max - min)) + min);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Creates Sessions Schema
const sessionsSchema = new Schema({

    sesid: { // Session ID
        type: String,
        default: Math.floor(Math.random() * (99999 - 10000)) + 10000 // this returns a number and will always be the same
        // till the server restarts, so assign random value outside
    },
    dateStart: { // Date Session Started
        type: String,
        default: Date.now() //YYYY:MM:DD:HH:MM
    },
    pid: { // ID of Professor Host
        type: String,
        default: uuidv4()
    },
    courseCode: {
        type: String,
        required: true
    }
});

module.exports = sessions = mongoose.model('sessions', sessionsSchema);
/*
// Note: we need to check if sesid already exists, wherever this model is being created
function getRandomArbitrary(min, max) { // max = 99 999, min= 10 000
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    sessions.findOne({ sesid: randomNum }, function (err, result) {
        if (err) { // Internal Error
            return String(randomNum);
        }
        else if (result && result.sesid === randomNum) { // duplicate session exists
            return getRandomArbitrary(10000 ,99999 )
        }
        else { // Did not find Session
            return String(randomNum);
        }

    })
}

sessionsSchema.sesid = getRandomArbitrary(99999, 10000)
console.log(sessionsSchema.sesid)
*/