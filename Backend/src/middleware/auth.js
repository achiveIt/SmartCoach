import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  req.user = verified;
  next();
});