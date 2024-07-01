const express = require('express');
const router = express.Router();

const ChatController = new (require('../Controllers/Chat.controller'))();

const verifyToken = require('../Middleware/verifyToken');

router.route('/').post(verifyToken, ChatController.getChats);

module.exports = router;
