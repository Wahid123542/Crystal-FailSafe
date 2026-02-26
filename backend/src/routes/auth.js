const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { signup, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');

const signupValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required')
    .custom(val => val.endsWith('@crystalbridges.org')).withMessage('Must use Crystal Bridges email'),
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', body('email').isEmail(), forgotPassword);
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 })
], resetPassword);

module.exports = router;
