const fs = require('fs');
const moment = require('moment');
const mdq = require('mongo-date-query');
const json2csv = require('json2csv').parse;
const path = require('path')
const fields = ['studentID', 'sessionID', 'dateJoined' , 'value', 'old_value', 'timeRating' , 'comment'];
const Record = require('./records')
 // Getting sessionID from the front end. Not too sure about this
const sesID: require('./sessionsList.js').sesID

// After calling the API call, use the Handler (a function) to deal with our get request.
router.get('/', function (req, res) {

  // Gets all records for the session with the given sessionID
  Record.find({sesID: sesID }, function (err, record) {
    if (err) {
      return res.status(500).json({ err });
    }
    // If no error, lets try to convert our JSON results into CSV
    else {
      let csv
      try {
	// Put all the records you queried into a csv with the specified fields
        // Keeping sessionID, even though it's redundent incase needed to join some tables later
	// Convert student json response into csv with json2csv by passing fields as options
	csv = json2csv(record, { fields });
      } catch (err) {
        return res.status(500).json({ err });
      }
      // Getting current datetime.
      const dateTime = moment().format('YYYYMMDDhhmmss');
	// Create a file path for where to store the data
      const filePath = path.join(__dirname, "..", "public", "exports", "csv-" + dateTime + ".csv")
	// Write into the csv where that filepath is located
      fs.writeFile(filePath, csv, function (err) {
        if (err) {
          return res.json(err).status(500);
        }
        else {
          setTimeout(function () {
            fs.unlinkSync(filePath); // delete this file after 30 seconds
          }, 30000)
          return res.json("/exports/csv-" + dateTime + ".csv");
        }
      });

    }
  })
})
