const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { sendEmail, emailTemplates } = require('../utils/email');

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── SIGNUP ─────────────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, employeeId, department, phone, password } = req.body;

    // Check if email already exists
    const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Check if employee ID already exists
    const [existingEmpId] = await pool.query('SELECT id FROM users WHERE employee_id = ?', [employeeId]);
    if (existingEmpId.length > 0) {
      return res.status(409).json({ error: 'Employee ID already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, employee_id, department, phone, password, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'staff', 'pending')`,
      [firstName, lastName, email, employeeId, department, phone || null, hashedPassword]
    );

    const newUser = { id: result.insertId, first_name: firstName, last_name: lastName, email, employee_id: employeeId, department };

    // Send confirmation email to user
    await sendEmail(email, emailTemplates.signupPending(newUser));

    // Notify all admins
    const [admins] = await pool.query("SELECT email FROM users WHERE role = 'admin' AND status = 'approved'");
    for (const admin of admins) {
      await sendEmail(admin.email, emailTemplates.newUserAlert(newUser));
    }

    res.status(201).json({
      message: 'Account request submitted. You will be notified once approved.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup.' });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check account status
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending admin approval.' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account request was rejected. Please contact IT.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        department: user.department,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// ─── GET CURRENT USER ────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    }
  });
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const user = rows[0];
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, resetExpires, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(email, {
      subject: 'Crystal FailSafe - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1d4ed8; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
          </div>
          <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
            <h2>Password Reset Request</h2>
            <p>Hi ${user.first_name}, click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
            <p style="color: #64748b; font-size: 14px; margin-top: 24px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, rows[0].id]
    );

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { signup, login, getMe, forgotPassword, resetPassword };
