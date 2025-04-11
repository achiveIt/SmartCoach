import express from 'express';
import { createBooking, cancelBooking } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.delete('/:id', verifyToken, cancelBooking);

export default router;
