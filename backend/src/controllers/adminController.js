const { pool } = require('../config/db');
const { sendEmail, emailTemplates } = require('../utils/email');

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT id, first_name, last_name, email, employee_id, department, phone, role, status, created_at FROM users';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await pool.query(query, params);
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
};

// ─── APPROVE USER ─────────────────────────────────────────────────────────────
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = rows[0];

    if (user.status === 'approved') {
      return res.status(400).json({ error: 'User is already approved.' });
    }

    await pool.query("UPDATE users SET status = 'approved' WHERE id = ?", [id]);

    // Notify user
    await sendEmail(user.email, emailTemplates.accountApproved(user));

    res.json({ message: `${user.first_name} ${user.last_name}'s account has been approved.` });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Server error approving user.' });
  }
};

// ─── REJECT USER ──────────────────────────────────────────────────────────────
const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = rows[0];

    await pool.query("UPDATE users SET status = 'rejected' WHERE id = ?", [id]);

    // Notify user
    await sendEmail(user.email, emailTemplates.accountRejected(user, reason));

    res.json({ message: `${user.first_name} ${user.last_name}'s account has been rejected.` });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ error: 'Server error rejecting user.' });
  }
};

// ─── UPDATE USER ROLE ─────────────────────────────────────────────────────────
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['staff', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    // Prevent removing own admin role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User role updated successfully.' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Server error updating role.' });
  }
};

// ─── DELETE USER ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error deleting user.' });
  }
};

module.exports = { getUsers, approveUser, rejectUser, updateUserRole, deleteUser };
