const { body, header } = require('express-validator');

exports.signUp = [
    body("name", "Please provide valid name").trim().notEmpty(),
    body("email", "Please provide valid email").trim().isEmail(),
    body("phone", "Please provide valid phone").isInt().notEmpty(),
    body("password", "Please provide valid password").trim().notEmpty(),
];

exports.signIn = [
    body("email", "Please provide valid email").trim().isEmail(),
    body("password", "Please provide valid password").trim().notEmpty(),
];
