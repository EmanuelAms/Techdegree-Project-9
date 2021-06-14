'use strict';

// load modules
const express = require('express');
const bcrypt = require('bcrypt');

// import middleware and Users model
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Users } = require('../models');

// set up router
const router = express.Router();
router.use(express.json());

// Route that returns currently authenticated user along with a 200 HTTP status code.
// password, createdAt, updatedAt, are filtered out of the response.

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {

  const user = req.currentUser;

  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });

}));

// Route that creates a new user, sets the Location header to "/", and returns a 201 HTTP status code and no content  

router.post('/users', asyncHandler(async (req, res) => {
    
  try {
    const user = await Users.create(req.body);

    // The user's password is hashed with bcrypt before persisting the user to the database
    user.update(
      {password: bcrypt.hashSync(user.password, 10)}
    );

    res.location('/').status(201).end();
  } catch (error) {

  // If any of the required values are not properly submitted, the route returns a 400 HTTP status code and validation errors  
  // If a SequelizeUniqueConstraintError is thrown, the route returns a 400 HTTP status code and an error message

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => err.message);
    res.status(400).json({ errors });   
  } else {
    throw error;
  }
}

}));

module.exports = router;