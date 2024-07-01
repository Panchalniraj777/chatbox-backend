const express = require("express");

const AuthController = new (require("../Controllers/Auth.controller"))();
const AuthValidator = require("../Middleware/validators/AuthValidator");
const Validator = require("../Middleware/validators/validationVerify");

const router = express.Router();

//ROUTES
router
  .route("/signUp")
  .post(AuthValidator.signUp, Validator, AuthController.signUp);

router
  .route("/signIn")
  .post(AuthValidator.signIn, Validator, AuthController.SignIn);

module.exports = router;
