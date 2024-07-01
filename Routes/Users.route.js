const express = require('express');
const router = express.Router();

const UserController = new (require('../Controllers/User.controller'))();

const UserValidator = require('../Middleware/validators/User.Validator');
const Validator = require('../Middleware/validators/validationVerify');
const verifyToken = require('../Middleware/verifyToken');

//ROUTES
router
    .route('/profile')
    .get(verifyToken, UserValidator.getProfile, Validator, UserController.getProfile)

router.route('/users').get(verifyToken, UserController.getUsers);

module.exports = router;
