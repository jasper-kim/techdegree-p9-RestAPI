const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { models } = require('../db');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Global variable set to Course model.
const { User, Course } = models;

// Set a middleware that attempts to get the user credentials
// and search a matched user and verify if provided password is matched.
const authenticateUser = async (req, res, next) => {
    const users = await User.findAll();
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

// get route that retrieve a list of courses.
router.get('/', (req, res) => {
    ( async () => {
        try {
            const courses = await Course.findAll({
                attributes: [
                        'id', 
                        'title', 
                        'description', 
                        'estimatedTime', 
                        'materialsNeeded', 
                        'userId'
                ],
                include: [
                        {
                          model: User,
                          attributes: [
                                'id', 
                                'firstName', 
                                'lastName', 
                                'emailAddress'
                            ]
                        },
                ]
            });
            res.status(200).json(courses).end();
        } catch(err) {
            console.error('Cannot get a list of courses: ', err);
        }
    } ) ();
});

// get route that retrieve a course having the provided id.
router.get('/:id', (req, res) => {
    ( async () => {
        try {
            const course = await Course.findByPk(req.params.id,
                {
                    attributes: [
                        'id', 
                        'title', 
                        'description', 
                        'estimatedTime', 
                        'materialsNeeded', 
                        'userId'
                    ],
                    include: [
                        {
                          model: User,
                          attributes: [
                                'id', 
                                'firstName', 
                                'lastName', 
                                'emailAddress'
                            ]
                        },
                    ]
                }
            );

            if(course !== null) {
                res.json(course).status(200).end();
            } else {
                res.status(400).end();
            }
            
        } catch(err) {
            console.error('Cannot get a course for the provided course ID: ', err);
        }
    } ) ();
});

// post route that creates a new course.
router.post('/', authenticateUser, [
    // Validate required values contained in request body
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "title"'),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
  ], (req, res) => {
      // Attempt to get the validation result from the Request object.
      const errors = validationResult(req);
  
      // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
        // Send validation error(s) with 400 status code   
        return res.status(400).json({ errors: errorMessages});
    }

    // Create a new course
    ( async () => {
        try {
            const course = await Course.create(req.body);
            // Set the status to 201 Created and end the response.
            return res.location(`/api/courses/${course.id}`).status(201).end();
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();
});

// put route that update a exsting course.
router.put('/:id', authenticateUser, [
    // Validate required values contained in request body
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "title"'),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
  ], (req, res) => {
      // Attempt to get the validation result from the Request object.
      const errors = validationResult(req);
  
      // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
        // Send validation error(s) with 400 status code    
        return res.status(400).json({ errors: errorMessages});
    }

    // Update a new course
    ( async () => {
        try {
            // Search a course using provided id
            const course = await Course.findByPk(req.params.id);

            const user = req.currentUser;

            if (course.userId === user.id) {
                // Update a searched course
                await course.update(req.body);
                // Set the status to 204 Created and end the response.
                return res.status(204).end();
            } else {
                return res.status(403).end();
            }
            
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();
});

router.delete('/:id', authenticateUser, (req, res) => {
    // Delete a new course
    ( async () => {
        try {
            // Search a course using provided id
            const course = await Course.findByPk(req.params.id);

            const user = req.currentUser;

            //If the course with provided id exists and its userId is equal to user's id...
            if (course != null && course.userId === user.id) {
                // Delete a searched course
                await course.destroy();
                // Set the status to 204 Created and end the response.
                return res.status(204).end();
            } else {
                return res.status(403).end();
            }
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();
});

module.exports = router;