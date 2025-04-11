import { pool } from '../utils/db.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSeats = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM seats ORDER BY row_number, seat_number');
  res.json(result.rows);
});
