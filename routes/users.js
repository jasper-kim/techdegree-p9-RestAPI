const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { models } = require('../db');
const bcryptjs = require('bcryptjs');

const auth = require('basic-auth');

// Global variable set to User model.
const { User, Course } = models;

// Set a middleware that attempts to get the user credentials
// and search a matched user and verify if provided password is matched.
const authenticateUser = async (req, res, next) => {
  const users = await User.findAll({
    include: [
      {
        model: Course,
      },
    ]
  });
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Search a user using provided username
    const user = users.find(user => user.emailAddress === credentials.name);

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);

        // Then store the retrieved user object on the request object
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    } 
  } else {
    message = 'Auth header not found';
  }
  
  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Call the next() method, if user authentication succeeded
    next();
  }
}

// get route that retrieve currently authenticated user.
router.get('/', authenticateUser, (req, res) => {
  (async () => {
    const user = await User.findByPk(req.currentUser.id, 
      {
        attributes: [
          'id', 
          'firstName', 
          'lastName', 
          'emailAddress'
      ],
      include: [
          {
            model: Course,
            attributes: [
              'id', 
              'title', 
              'description', 
              'estimatedTime', 
              'materialsNeeded', 
              'userId'
              ]
          },
      ]
      }
    );

    return res.json(user).status(200).end();
  }) ();
});

// post route that creates a new user.
router.post('/', [
    // Validate required values contained in request body
    check('firstName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "first name"'),
    check('lastName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "last name"'),
    check('emailAddress')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "email address"')
      // Validate if the provided email is valid
      .normalizeEmail({ all_lowercase: true })
      .isEmail()
      .withMessage('Email address is invalid!')
      // Validate if the provided email is already taken
      .custom(async(value) => {
        const user = await User.findAll({
          //find search term in columns
          where: {
            emailAddress: value,
          }
        });
        if (user.length > 0) {
          throw new Error();
        }
      })
      .withMessage('E-mail already in use'),
    check('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "password"'),
  ], (req, res) => {
      // Attempt to get the validation result from the Request object.
      const errors = validationResult(req);
  
      // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
  
      return res.status(400).json({ errors: errorMessages});
    }

    // Get the user from the request body.
    let { firstName, lastName, emailAddress, password } = req.body;

    // Hash the new user's password.
    password = bcryptjs.hashSync(password);

    // Create a new user
    ( async () => {
        try {
            await User.create({ firstName, lastName, emailAddress, password });
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();

    // // Set the status to 201 Created and end the response.
    return res.location('/').status(201).end();
});

module.exports = router;