const express = require('express');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

const SESSION_HOURS = 24;

async function requireCustomer(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const result = await db.query(
    `SELECT s.customer_id, s.expires_at, u.full_name, u.email, u.phone
     FROM customer_session s
     JOIN customer_user u ON u.id = s.customer_id
     WHERE s.token = $1`,
    [token]
  );

  if (!result.rows.length) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const session = result.rows[0];
  if (new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Session expired' });
  }

  req.customer = {
    id: session.customer_id,
    fullName: session.full_name,
    email: session.email,
    phone: session.phone
  };
  next();
}

router.post('/auth/register', async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }

    const existing = await db.query('SELECT id FROM customer_user WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const result = await db.query(
      `INSERT INTO customer_user (full_name, email, phone, password_hash)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')))
       RETURNING id`,
      [fullName, email, phone || null, password]
    );

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO customer_session (customer_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [result.rows[0].id, token, expiresAt]
    );

    res.json({ token, fullName });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await db.query(
      `SELECT id, full_name
       FROM customer_user
       WHERE email = $1 AND password_hash = crypt($2, password_hash)`,
      [email, password]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO customer_session (customer_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [result.rows[0].id, token, expiresAt]
    );

    res.json({ token, fullName: result.rows[0].full_name });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/logout', requireCustomer, async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    await db.query('DELETE FROM customer_session WHERE token = $1', [token]);
    res.json({ status: 'logged_out' });
  } catch (err) {
    next(err);
  }
});

router.get('/auth/me', requireCustomer, (req, res) => {
  res.json(req.customer);
});

module.exports = router;
