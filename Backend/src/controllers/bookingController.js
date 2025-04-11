import { pool } from '../utils/db.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { seatCount } = req.body;
  const userId = req.user.id;

  const result = await pool.query('SELECT * FROM seats WHERE is_reserved = false ORDER BY row_number, seat_number');
  const seats = result.rows;

  if (seats.length < seatCount) return res.status(400).json({ error: 'Not enough seats available' });

  let chosenSeats = [];

  for (let row = 1; row <= 12; row++) {
    const seatsInRow = seats.filter(s => s.row_number === row);
    if (seatsInRow.length >= seatCount) {
      chosenSeats = seatsInRow.slice(0, seatCount);
      break;
    }
  }

  if (chosenSeats.length === 0) {
    chosenSeats = seats.slice(0, seatCount);
  }

  const ids = chosenSeats.map(s => s.id);

  await Promise.all(
    ids.map(id =>
      pool.query('UPDATE seats SET is_reserved = true, reserved_by = $1 WHERE id = $2', [userId, id])
    )
  );

  await pool.query('INSERT INTO bookings (user_id, seat_ids) VALUES ($1, $2)', [userId, ids]);

  res.json({ message: 'Booking successful', seats: ids });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  const result = await pool.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [bookingId, userId]);
  const booking = result.rows[0];

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  await Promise.all(
    booking.seat_ids.map(id =>
      pool.query('UPDATE seats SET is_reserved = false, reserved_by = NULL WHERE id = $1', [id])
    )
  );

  await pool.query('DELETE FROM bookings WHERE id = $1', [bookingId]);
  res.json({ message: 'Booking cancelled' });
});