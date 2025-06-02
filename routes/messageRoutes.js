const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, messageController.getMessages);
router.post('/', authenticate, messageController.sendMessage);

module.exports = router;
