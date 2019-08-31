const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { models } = require('../db');
const bcryptjs = require('bcryptjs');

const User = models.User;

// get route that retrieve currently authenticated user.
router.get('/', (req, res) => {
    ( async () => {
        try {
            const users = await User.findAll();
            res.json(users).status(200).end();
        } catch(err) {
            console.error('Cannot get user\'s info: ', err);
        }
    } ) ();
});

// post route that creates a new user.
router.post('/', [
    check('firstName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "first name"'),
    check('lastName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "last name"'),
    check('emailAddress')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "email address"'),
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
  
      return res.status(400).json({ error: errorMessages});
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
    return res.status(201).end();
});

module.exports = router;