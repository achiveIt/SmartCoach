import express from 'express';
import { getAllSeats } from '../controllers/seatController.js';

const router = express.Router();

router.get('/', getAllSeats);

export default router;