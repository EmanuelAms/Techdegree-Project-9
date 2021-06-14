'use strict';

const { response } = require('express');
// load modules
const express = require('express');

// import middleware and Courses model
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Courses } = require('../models');
const { Users } = require('../models');

// set up router
const router = express.Router();
router.use(express.json());

// Route that returns a list of all courses including the User that owns each course and a 200 HTTP status code
// createdAt and updatedAt are filtered out of the response

router.get('/courses', asyncHandler(async (req, res) => {

  const courses = await Courses.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Users,
      attributes:['firstName', 'lastName']
  }
  });

  res.status(200).json(courses);

}));

// Route that returns the corresponding course along with the User that owns that course and a 200 HTTP status code
// createdAt and updatedAt are filtered out of the response

router.get('/courses/:id', asyncHandler(async (req, res) => {

  const course = await Courses.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Users,
      attributes:['firstName', 'lastName']
  }
  });

  res.status(200).json(course);

}));

// Route that creates a new course, sets the Location header to the URI for the newly created course, returns a 201 HTTP status code and no content

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {

  try {
    const course = await Courses.create(req.body);
    res.location(`/courses/${course.id}`).status(201).end();
  } catch (error) {

    // If any of the required values are not properly submitted, the route returns a 400 HTTP status code and validation errors

    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route that updates the corresponding course and returns a 204 HTTP status code and no content

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {

  const course = await Courses.findByPk(req.params.id);

  // If the currently authenticated user is not the owner of the requested course, the route returns a 403 HTTP status code

  if (req.currentUser.id != course.userId) {
    res.status(403).end();
  }
  else {
    
  try {
    await course.update(req.body);
    res.status(204).end();
  } catch (error) {

    // If any of the required values are not properly submitted, the route returns a 400 HTTP status code and validation errors

    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}
}));

// Route that deletes the corresponding course and returns a 204 HTTP status code and no content

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {

  // If the currently authenticated user is not the owner of the requested course, the route returns a 403 HTTP status code

  const course = await Courses.findByPk(req.params.id);

  if (req.currentUser.id != course.userId) {
    res.status(403).end();
  }
  else {
  course.destroy();
  res.status(204).end();
  }
  
}));

module.exports = router;