const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── EMAIL TEMPLATES ────────────────────────────────────────────────────────

const emailTemplates = {
  // Sent to user after signup
  signupPending: (user) => ({
    subject: 'Crystal FailSafe - Account Request Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1d4ed8; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
          <p style="color: #bfdbfe; margin: 4px 0 0;">IT Support System</p>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b;">Hi ${user.first_name},</h2>
          <p style="color: #475569;">Your account request has been received and is pending admin approval.</p>
          <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>What happens next?</strong></p>
            <ul style="color: #1e40af; margin: 8px 0 0;">
              <li>An IT admin will review your credentials</li>
              <li>You'll receive an email once approved (usually within 24 hours)</li>
              <li>After approval, you can log in at the portal</li>
            </ul>
          </div>
          <p style="color: #475569;">Employee ID: <strong>${user.employee_id}</strong></p>
          <p style="color: #475569;">Department: <strong>${user.department}</strong></p>
        </div>
        <div style="background: #e2e8f0; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Crystal Bridges Museum of American Art - IT Department</p>
        </div>
      </div>
    `
  }),

  // Sent to admin when new user signs up
  newUserAlert: (user) => ({
    subject: `Crystal FailSafe - New Access Request: ${user.first_name} ${user.last_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1d4ed8; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
          <p style="color: #bfdbfe; margin: 4px 0 0;">Admin Notification</p>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b;">New Access Request</h2>
          <p style="color: #475569;">A new staff member has requested access to Crystal FailSafe.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; color: #64748b; width: 40%;">Name</td>
              <td style="padding: 8px; font-weight: bold; color: #1e293b;">${user.first_name} ${user.last_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; color: #64748b;">Email</td>
              <td style="padding: 8px; font-weight: bold; color: #1e293b;">${user.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; color: #64748b;">Employee ID</td>
              <td style="padding: 8px; font-weight: bold; color: #1e293b;">${user.employee_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #64748b;">Department</td>
              <td style="padding: 8px; font-weight: bold; color: #1e293b;">${user.department}</td>
            </tr>
          </table>
          <a href="${process.env.FRONTEND_URL}/admin/users" 
             style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Review Request
          </a>
        </div>
      </div>
    `
  }),

  // Sent to user when approved
  accountApproved: (user) => ({
    subject: 'Crystal FailSafe - Your Account Has Been Approved! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
          <p style="color: #bbf7d0; margin: 4px 0 0;">Account Approved</p>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b;">Great news, ${user.first_name}! 🎉</h2>
          <p style="color: #475569;">Your Crystal FailSafe account has been approved. You can now log in and start managing IT tickets.</p>
          <a href="${process.env.FRONTEND_URL}/login" 
             style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Login to Crystal FailSafe
          </a>
        </div>
      </div>
    `
  }),

  // Sent to user when rejected
  accountRejected: (user, reason) => ({
    subject: 'Crystal FailSafe - Access Request Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b;">Hi ${user.first_name},</h2>
          <p style="color: #475569;">Unfortunately, your access request could not be approved at this time.</p>
          ${reason ? `<p style="color: #475569;"><strong>Reason:</strong> ${reason}</p>` : ''}
          <p style="color: #475569;">If you believe this is an error, please contact your IT department directly.</p>
        </div>
      </div>
    `
  }),

  // Sent to ticket submitter when ticket is received
  ticketConfirmation: (ticket) => ({
    subject: `Crystal FailSafe - Ticket #${ticket.ticket_number} Received`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1d4ed8; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
          <p style="color: #bfdbfe; margin: 4px 0 0;">Ticket Confirmation</p>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b;">Your ticket has been received</h2>
          <div style="background: #dbeafe; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">Ticket #${ticket.ticket_number}</p>
            <p style="margin: 4px 0 0; color: #1e40af;">${ticket.subject}</p>
          </div>
          <p style="color: #475569;">Our IT team will review your ticket and respond as soon as possible.</p>
          <p style="color: #475569;"><strong>Priority:</strong> ${ticket.priority}</p>
          <p style="color: #475569;"><strong>Category:</strong> ${ticket.category}</p>
        </div>
      </div>
    `
  }),

  // Sent to user when ticket status changes
  ticketStatusUpdate: (ticket) => ({
    subject: `Crystal FailSafe - Ticket #${ticket.ticket_number} Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1d4ed8; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🎨 Crystal FailSafe</h1>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b;">Ticket Status Updated</h2>
          <p style="color: #475569;">Your ticket <strong>#${ticket.ticket_number}</strong> has been updated.</p>
          <p style="color: #475569;"><strong>New Status:</strong> ${ticket.status.replace('_', ' ').toUpperCase()}</p>
          <p style="color: #475569;"><strong>Subject:</strong> ${ticket.subject}</p>
          ${ticket.resolution_notes ? `<p style="color: #475569;"><strong>Notes:</strong> ${ticket.resolution_notes}</p>` : ''}
        </div>
      </div>
    `
  }),
};

// ─── SEND EMAIL FUNCTION ────────────────────────────────────────────────────

const sendEmail = async (to, template) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: template.subject,
      html: template.html,
    });
    console.log(`📧 Email sent to ${to}: ${template.subject}`);
  } catch (error) {
    // Log but don't crash the app if email fails
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

module.exports = { sendEmail, emailTemplates };
