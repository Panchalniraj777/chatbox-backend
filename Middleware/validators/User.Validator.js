const { query, body } = require("express-validator");

exports.getProfile = [
  query("id", "Please provide valid id").notEmpty().toInt(),
];
