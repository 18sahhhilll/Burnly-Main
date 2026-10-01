import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Venture from '../models/Venture.js';
import Scenario from '../models/Scenario.js';
import Report from '../models/Report.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'burnly_super_secret_jwt_key_change_in_production';
const getJwtRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'burnly_super_secret_refresh_jwt_key';

const hashToken = (token) => {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateAccessToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30m',
  });
};

const generateRefreshToken = (id, sessionId) => {
  return jwt.sign({ id, sessionId }, getJwtRefreshSecret(), {
    expiresIn: '7d',
  });
};

const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields (name, email, password)' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sessionId = crypto.randomUUID();
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      sessions: [],
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id, sessionId);
    const refreshTokenHash = hashToken(refreshToken);

    user.sessions.push({
      sessionId,
      refreshTokenHash,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    sendRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = crypto.randomUUID();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id, sessionId);
    const refreshTokenHash = hashToken(refreshToken);

    // Clean up expired sessions and push new session
    const now = new Date();
    user.sessions = (user.sessions || []).filter((s) => s.expiresAt > now);
    user.sessions.push({
      sessionId,
      refreshTokenHash,
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    sendRefreshTokenCookie(res, refreshToken);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error during login' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token cookie missing' });
    }

    let decoded = null;
    try {
      decoded = jwt.verify(token, getJwtRefreshSecret());
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const incomingHash = hashToken(token);
    const sessionIndex = (user.sessions || []).findIndex(
      (s) => s.sessionId === decoded.sessionId && s.refreshTokenHash === incomingHash
    );

    if (sessionIndex === -1) {
      // Reuse or revoked token detected: revoke ALL sessions for this user for security
      user.sessions = [];
      await user.save();
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      return res.status(401).json({ error: 'Refresh token invalid, revoked, or reused' });
    }

    // Rotate refresh token for this specific session
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id, decoded.sessionId);

    user.sessions[sessionIndex].refreshTokenHash = hashToken(newRefreshToken);
    user.sessions[sessionIndex].expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    sendRefreshTokenCookie(res, newRefreshToken);

    return res.json({ token: newAccessToken });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error during token refresh' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          user.sessions = (user.sessions || []).filter((s) => s.sessionId !== decoded.sessionId);
          await user.save();
        }
      } catch {
        // Token verification error ignored during logout cleanup
      }
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error during logout' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error fetching user profile' });
  }
};

export const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // Cascading deletion of all user's ventures, scenarios, reports, and sessions
    await Report.deleteMany({ userId });
    await Scenario.deleteMany({ userId });
    await Venture.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.json({ message: 'Account and all associated ventures, scenarios, and reports deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error deleting account' });
  }
};
