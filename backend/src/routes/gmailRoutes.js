const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { syncGmail, getAuthUrl, handleCallback } = require('../controllers/gmailController');

router.get('/auth-url', getAuthUrl);
router.get('/callback', handleCallback);
router.post('/sync', authenticate, syncGmail);

module.exports = router;
