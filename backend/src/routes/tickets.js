const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getTickets, getTicket, createTicket, updateTicket,
  addComment, deleteTicket, getAnalytics
} = require('../controllers/ticketsController');

router.use(authenticate);

router.get('/analytics', getAnalytics);
router.get('/', getTickets);
router.get('/:id', getTicket);

router.post('/', [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['hardware', 'software', 'account', 'network', 'other']).withMessage('Invalid category'),
  body('senderName').trim().notEmpty().withMessage('Sender name is required'),
  body('senderEmail').isEmail().withMessage('Valid sender email is required'),
], createTicket);

router.patch('/:id', updateTicket);
router.post('/:id/comments', [
  body('comment').trim().notEmpty().withMessage('Comment is required'),
], addComment);
router.delete('/:id', requireAdmin, deleteTicket);

module.exports = router;
