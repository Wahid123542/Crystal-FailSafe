const { pool } = require('../config/db');
const { sendEmail, emailTemplates } = require('../utils/email');

// Helper: generate ticket number
const generateTicketNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TKT-${timestamp}${random}`;
};

// ─── GET ALL TICKETS ─────────────────────────────────────────────────────────
const getTickets = async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_to_name,
        u.email AS assigned_to_email
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { query += ' AND t.status = ?'; params.push(status); }
    if (priority) { query += ' AND t.priority = ?'; params.push(priority); }
    if (category) { query += ' AND t.category = ?'; params.push(category); }
    if (search) {
      query += ' AND (t.subject LIKE ? OR t.sender_email LIKE ? OR t.ticket_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [tickets] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM tickets WHERE 1=1';
    const countParams = [];
    if (status) { countQuery += ' AND status = ?'; countParams.push(status); }
    if (priority) { countQuery += ' AND priority = ?'; countParams.push(priority); }
    if (category) { countQuery += ' AND category = ?'; countParams.push(category); }
    if (search) {
      countQuery += ' AND (subject LIKE ? OR sender_email LIKE ? OR ticket_number LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    res.json({
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Server error fetching tickets.' });
  }
};

// ─── GET SINGLE TICKET ────────────────────────────────────────────────────────
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const [tickets] = await pool.query(`
      SELECT t.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_to_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ?
    `, [id]);

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    // Get comments
    const [comments] = await pool.query(`
      SELECT tc.*, CONCAT(u.first_name, ' ', u.last_name) AS author_name, u.role AS author_role
      FROM ticket_comments tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.ticket_id = ?
      ORDER BY tc.created_at ASC
    `, [id]);

    // Get activity log
    const [activity] = await pool.query(`
      SELECT ta.*, CONCAT(u.first_name, ' ', u.last_name) AS user_name
      FROM ticket_activity ta
      LEFT JOIN users u ON ta.user_id = u.id
      WHERE ta.ticket_id = ?
      ORDER BY ta.created_at DESC
    `, [id]);

    res.json({ ticket: tickets[0], comments, activity });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Server error fetching ticket.' });
  }
};

// ─── CREATE TICKET ────────────────────────────────────────────────────────────
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, senderName, senderEmail, senderDepartment } = req.body;

    const ticketNumber = generateTicketNumber();

    const [result] = await pool.query(`
      INSERT INTO tickets (ticket_number, subject, description, category, priority, sender_name, sender_email, sender_department)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [ticketNumber, subject, description, category, priority || 'medium', senderName, senderEmail, senderDepartment || null]);

    const ticket = { id: result.insertId, ticket_number: ticketNumber, subject, priority: priority || 'medium', category };

    // Log activity
    await pool.query(
      'INSERT INTO ticket_activity (ticket_id, user_id, action, new_value) VALUES (?, ?, ?, ?)',
      [result.insertId, req.user.id, 'created', 'new']
    );

    // Send confirmation to submitter
    await sendEmail(senderEmail, emailTemplates.ticketConfirmation(ticket));

    res.status(201).json({ message: 'Ticket created successfully.', ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Server error creating ticket.' });
  }
};

// ─── UPDATE TICKET ────────────────────────────────────────────────────────────
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, resolutionNotes } = req.body;

    // Fetch current ticket
    const [current] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const ticket = current[0];
    const updates = [];
    const params = [];

    if (status && status !== ticket.status) {
      updates.push('status = ?');
      params.push(status);

      await pool.query(
        'INSERT INTO ticket_activity (ticket_id, user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [id, req.user.id, 'status_changed', ticket.status, status]
      );

      // If resolved, set resolved_at
      if (status === 'resolved') {
        updates.push('resolved_at = NOW()');
      }

      // Notify submitter of status change
      await sendEmail(ticket.sender_email, emailTemplates.ticketStatusUpdate({ ...ticket, status }));
    }

    if (priority && priority !== ticket.priority) {
      updates.push('priority = ?');
      params.push(priority);
      await pool.query(
        'INSERT INTO ticket_activity (ticket_id, user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [id, req.user.id, 'priority_changed', ticket.priority, priority]
      );
    }

    if (assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assignedTo || null);
      await pool.query(
        'INSERT INTO ticket_activity (ticket_id, user_id, action, new_value) VALUES (?, ?, ?, ?)',
        [id, req.user.id, 'assigned', assignedTo]
      );
    }

    if (resolutionNotes !== undefined) {
      updates.push('resolution_notes = ?');
      params.push(resolutionNotes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(id);
    await pool.query(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ message: 'Ticket updated successfully.' });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Server error updating ticket.' });
  }
};

// ─── ADD COMMENT ─────────────────────────────────────────────────────────────
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, isInternal = false } = req.body;

    const [ticket] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
    if (ticket.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    await pool.query(
      'INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal) VALUES (?, ?, ?, ?)',
      [id, req.user.id, comment, isInternal]
    );

    res.status(201).json({ message: 'Comment added successfully.' });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error adding comment.' });
  }
};

// ─── DELETE TICKET (admin only) ───────────────────────────────────────────────
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    res.json({ message: 'Ticket deleted successfully.' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ error: 'Server error deleting ticket.' });
  }
};

// ─── GET ANALYTICS ────────────────────────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    const intervals = { week: 7, month: 30, year: 365 };
    const days = intervals[range] || 7;

    const [[totals]] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'new') AS new_count,
        SUM(status = 'in_progress') AS in_progress_count,
        SUM(status = 'resolved') AS resolved_count,
        SUM(status = 'closed') AS closed_count,
        AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) AS avg_resolution_hours
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [days]);

    const [byCategory] = await pool.query(`
      SELECT category, COUNT(*) AS count
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY category
    `, [days]);

    const [byPriority] = await pool.query(`
      SELECT priority, COUNT(*) AS count
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY priority
    `, [days]);

    const [dailyTrend] = await pool.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);

    const [topIssues] = await pool.query(`
      SELECT subject, COUNT(*) AS count
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY subject
      ORDER BY count DESC
      LIMIT 5
    `, [days]);

    res.json({ totals, byCategory, byPriority, dailyTrend, topIssues });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error fetching analytics.' });
  }
};

module.exports = { getTickets, getTicket, createTicket, updateTicket, addComment, deleteTicket, getAnalytics };
