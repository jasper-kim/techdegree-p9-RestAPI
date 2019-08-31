const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { models } = require('../db');

const Course = models.Course;

// get route that retrieve a list of courses.
router.get('/', (req, res) => {
    ( async () => {
        try {
            const courses = await Course.findAll();
            res.json(courses).status(200).end();
        } catch(err) {
            console.error('Cannot get a list of courses: ', err);
        }
    } ) ();
});

// get route that retrieve a course having the provided id.
router.get('/:id', (req, res) => {
    ( async () => {
        try {
            const course = await Course.findByPk(req.params.id);
            res.json(course).status(200).end();
        } catch(err) {
            console.error('Cannot get a course for the provided course ID: ', err);
        }
    } ) ();
});

// post route that creates a new course.
router.post('/', [
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "title"'),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
    check('estimatedTime')
      .exists({ checkNull: false, checkFalsy: false })
      .withMessage('Please provide a value for "estimated time"'),
    check('materialsNeeded')
      .exists({ checkNull: false, checkFalsy: false })
      .withMessage('Please provide a value for "materials needed"'),
  ], (req, res) => {
      // Attempt to get the validation result from the Request object.
      const errors = validationResult(req);
  
      // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
  
      return res.status(400).json({ error: errorMessages});
    }

    // Create a new course
    ( async () => {
        try {
            await Course.create(req.body);
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();

    // // Set the status to 201 Created and end the response.
    return res.status(201).end();
});

// put route that update a exsting course.
router.put('/:id', [
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "title"'),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
    check('estimatedTime')
      .exists({ checkNull: false, checkFalsy: false })
      .withMessage('Please provide a value for "estimated time"'),
    check('materialsNeeded')
      .exists({ checkNull: false, checkFalsy: false })
      .withMessage('Please provide a value for "materials needed"'),
  ], (req, res) => {
      // Attempt to get the validation result from the Request object.
      const errors = validationResult(req);
  
      // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
  
      return res.status(400).json({ error: errorMessages});
    }

    // Update a new course
    ( async () => {
        try {
            // Search a course using provided id
            const course = await Course.findByPk(req.params.id);
            // Update a searched course
            await course.update(req.body);
            // Set the status to 204 Created and end the response.
            return res.status(204).end();
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();
});

router.delete('/:id', (req, res) => {
    // Delete a new course
    ( async () => {
        try {
            // Search a course using provided id
            const course = await Course.findByPk(req.params.id);
            // Delete a searched course
            await course.destroy();
            // Set the status to 204 Created and end the response.
            return res.status(204).end();
        } catch(err) {
            console.error('Oh noooo!! Error: ', err);
        } 
    } ) ();
});

module.exports = router;