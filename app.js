'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
var cors = require('cors');

// load database
const db = require('./db');

// synchronize Models with the Database
( async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log('Synchronize to the database successful!!');
  } catch(err) {
    console.error('Error connecting to the database: ', error);
  }
} ) ()

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Enable all CORS Requests
var corsOptions = {
  exposedHeaders: 'Location',
}

app.use(cors(corsOptions));

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});