const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates Student Schema
const studentSchema = new Schema({    
    sid: { // TBD: MAC Address / Device Model / Cookies / Student #
        type: String, 
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = student = mongoose.model('student', studentSchema);
