const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Student = require('../../models/Student');
const uuidv4 = require('uuid/v4');

//Session Model
const Session = require('../../models/Sessions');

const cookieConfig = {
    //httpOnly: true, // to disable accessing cookie via client side js
    secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    // signed: true // if you use the secret with cookieParser
};

router.post('/FindSession', (req, res) => {
    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        //res.send(result);
        if (err) { // Internal Error
            //callback(err);
            res.status(err.status).send({ success: false });
            return;
        }
        else if (result && result.sesid === req.body.sesid) { // Found Session
            //res.cookie('sesid', result.sesid);
            res.send({ success: true });
            console.log(result);
        }
        else { // Did not find Session
            console.log('DID NOT FIND SESSION');
            res.status(404).send({ success: false, response: 'DID NOT FIND SESSION' });
            console.log(result);
        }
    })
})

// @route   GET api/sessions/AllSessions
// @desc    Get a session
// @access  Public

router.get('/AllSessions', (req, res) => {
    Session.find({ pid: req.query.pid, courseCode: req.query.courseCode }, function (err, result) {
        if (err) { // Internal Error
            //callback(err);
            res.status(err.status).send({ success: false });
            return;
        }
        else if (result != undefined && result[0] != undefined && result[0].pid == req.query.pid) { // Found Sessions
            console.log(result);
            console.log('THIS IS IT');
            res.json(result);
        }
        else {
            console.log(result);
            res.status(404).json(result);
        }
    })
});

router.get('/FindCourse', (req, res) => {
    Session.find({ pid: req.query.pid }).distinct('courseCode', req.query.sesid, function (err, result) { //see the use of distinct
        if (err) { // Internal Error
            //callback(err);
            res.status(err.status).send({ success: false });
            return;
        }
        else {
            console.log('THIS IS IT');
            res.json(result);
        }
    });
});

// If Session not found
// res.send({ success: false });

// Set a cookie example
// res.cookie('sesid', result.sesid);

// Remove a cookie
//  res.clearCookie("sesid");

// Get a Cookie
// req.cookies['cookieName']
// res.clearCookie("cookie-name");
router.post('/JoinSession', (req, res) => {
    //res.send(req.cookies['sid'] === null);
    var student;
    student = req.cookies['sid'];
    console.log(student);
    //res.send(req.cookies['sid'] == 'undefined');
    console.log('Result Cookie:', res.cookies);
    if (student == 'undefined' || student == null || student == undefined) { // New Student
        console.log('1');
	let aStudent = new Student({ sid: uuidv4() });
        student = aStudent.sid;
        res.cookie('sid', aStudent.sid);
        // res.send(newStudent.sid);
        console.log("NEW STUDENT");
        //res.send('NEW STUDENT');
    }
    else { // Find Student in DB
        Student.findOne({ sid: student }, function (err, result) {
            if (err) { // Internal Error
                console.log('2');
		//callback(err);
                return res.send({ success: false });        
            }
            else if (result && result != []) { // Found existing student
                console.log('3');
		//res.status(302).json(result);
                student = result;
                console.log("EXISTING STUDENT", result);

            }
            else { // No student exists, make a new one
                console.log('4');
   		let aStudent = new Student({ sid: uuidv4() });
                student = aStudent.sid;
                //res.cookie('sid', aStudent.sid);
                //.json({ success: false });;
                //res.json(newStudent);

            }
        })
    }

    // store student's id in cookie
    // res.cookie('sid', student.sid);

    //console.log(student.sid);
    // Find Session asked to join
    //res.send(req.body.sesid);
    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        //res.send(result);
        if (err) { // Internal Error
            //callback(err);
            console.log('5');
	    return res.send({ success: false });
        }
        else if (result && result.sesid === req.body.sesid) { // Found Session
            console.log('6');
   	    student.currentSesID = result.sesid;
    	    res.cookie('sesid', result.sesid)
	   res.send({ success: true }); 
	   return;   
	console.log(result);
        }
        else { // Did not find Session
            
	    console.log('7');
            return res.status(404).send({ success: false, });
	    console.log(result);
        }
        //res.json(result);

    })

});

// @route   POST api/sessions
// @desc    Create a session
// @access  Private localhost:3000 (front-end)
router.post('/', (req, res) => {
    console.log(`Received POST request for course: ${req.body.courseCode}`)
    const newSession = new Session({
        courseCode: req.body.courseCode,
        pid: req.body.pid,
        sesid: req.body.sesid
    });


    newSession.save().then(sessions => res.json(sessions))
});


// To Do: Currently not working
// @route   DELETE api/sessions/:sesid
// @desc    Delete a session
// @access  Public (Should be private in real production)
router.delete('/', (req, res) => {

    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        if (err) res.status(404).json({ success: false });
        result => result.remove().then(() => res.json({ success: true }))
            .catch(err => res.status(404).json({ success: false }));
    })

});

module.exports = router;
