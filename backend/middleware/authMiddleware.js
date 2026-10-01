import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'burnly_super_secret_jwt_key_change_in_production');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'User not found. Authorization denied.' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};
