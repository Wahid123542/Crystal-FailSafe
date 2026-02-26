const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getUsers, approveUser, rejectUser, updateUserRole, deleteUser } = require('../controllers/adminController');

router.use(authenticate, requireAdmin);

router.get('/users', getUsers);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
