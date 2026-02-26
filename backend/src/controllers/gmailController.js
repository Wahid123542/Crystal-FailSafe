const { google } = require('googleapis');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pool } = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getOAuthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });
  return oauth2Client;
};

const decodeBody = (data) => {
  if (!data) return '';
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
};

const extractBody = (payload) => {
  if (!payload) return '';
  if (payload.body?.data) return decodeBody(payload.body.data);
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) return decodeBody(part.body.data);
    }
    for (const part of payload.parts) {
      const nested = extractBody(part);
      if (nested) return nested;
    }
  }
  return '';
};

const analyzeWithGemini = async (subject, body) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an IT support assistant at Crystal Bridges Museum of American Art.
Analyze this email and determine if it is an IT support issue.
Email Subject: ${subject}
Email Body: ${body}
Respond ONLY with a valid JSON object:
{
  "is_ticket": true or false,
  "summary": "One or two sentence technical summary",
  "category": "hardware" or "software" or "network" or "account" or "access" or "other",
  "priority": "urgent" or "high" or "medium" or "low"
}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini analysis failed:', err.message);
    return { is_ticket: true, summary: subject, category: 'other', priority: 'medium' };
  }
};

const getAuthUrl = (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.modify'],
      prompt: 'consent',
    });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ GMAIL REFRESH TOKEN:', tokens.refresh_token);
    console.log('Add this to your .env as GMAIL_REFRESH_TOKEN\n');
    res.json({ message: 'Auth successful! Check your terminal for the refresh token.', refresh_token: tokens.refresh_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const syncGmail = async (req, res) => {
  try {
    const auth = getOAuthClient();
    const gmail = google.gmail({ version: 'v1', auth });
    const since = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    const listRes = await gmail.users.messages.list({
      userId: 'me',
     q: `in:anywhere after:${since} from:@crystalbridges.org`,
      maxResults: 20,
    });
    const messages = listRes.data.messages || [];
    if (messages.length === 0) return res.json({ message: 'No new emails found.', created: 0, tickets: [] });
    let created = 0;
    const newTickets = [];
    for (const msg of messages) {
      const [existing] = await pool.query('SELECT id FROM tickets WHERE gmail_message_id = ?', [msg.id]);
      if (existing.length > 0) continue;
      const fullMsg = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
      const headers = fullMsg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '(No subject)';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
      const fromMatch = from.match(/^(.*?)\s*<(.+?)>$/) || [null, from, from];
      const senderName = fromMatch[1]?.trim() || from;
      const senderEmail = fromMatch[2]?.trim() || from;
      const body = extractBody(fullMsg.data.payload);
      const analysis = await analyzeWithGemini(subject, body);
      if (!analysis.is_ticket) {
        await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } });
        continue;
      }
      const ticketNumber = `GM-${Date.now().toString().slice(-6)}`;
      const [result] = await pool.query(`
        INSERT INTO tickets (ticket_number, subject, description, category, priority, sender_name, sender_email, status, ai_summary, gmail_message_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
      `, [ticketNumber, subject, body, analysis.category, analysis.priority, senderName, senderEmail, analysis.summary, msg.id, new Date(date)]);
      await gmail.users.messages.modify({ userId: 'me', id: msg.id, requestBody: { removeLabelIds: ['UNREAD'] } });
      newTickets.push({
        id: result.insertId, ticket_number: ticketNumber, subject,
        from_name: senderName, from_email: senderEmail,
        ai_summary: analysis.summary, ai_category: analysis.category,
        ai_priority: analysis.priority, status: 'new',
        received_at: new Date(date).toISOString(), assigned_to: null,
      });
      created++;
    }
    res.json({ message: `Synced ${messages.length} emails, created ${created} tickets.`, created, tickets: newTickets });
  } catch (error) {
    console.error('Gmail sync error:', error);
    res.status(500).json({ error: 'Failed to sync Gmail: ' + error.message });
  }
};

module.exports = { syncGmail, getAuthUrl, handleCallback };
