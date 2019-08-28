'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// configure Sequelize
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db'
});

// test connection to database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!!');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
  }
}) ();

// User model
class User extends Sequelize.Model {}
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  emailAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { sequelize });

// Course model
class Course extends Sequelize.Model {}
Course.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  estimatedTime: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  estimatedTime: {
    type: Sequelize.STRING,
    materialsNeeded: true,
  },
}, { sequelize });

// synchronize Models with the Database
( async () => {
  // Sync 'Movies' table
  try {
    await sequelize.sync({ force: true });
    console.log('Synchronize to the database successful!!');
  } catch(err) {
    console.error('Error connecting to the database: ', error);
  }
} ) ()

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

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
