const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const items = require('./routes/api/items');

const app = express();

//Bodyparser Middleware
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose
    .connect(db, {useNewUrlParser: true, useCreateIndex: true})
    .then(() => console.log('Connected to Server!'))
    .catch(err => console.log(err));

//Use Routes
app.use('/api/items', items);

const port =  process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

  