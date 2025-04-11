import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../utils/db.js';
import asyncHandler from '../utils/asyncHandler.js';

export const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [
    username,
    email,
    hashedPassword,
  ]);
  res.status(201).json({ message: 'User created' });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});