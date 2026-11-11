import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ragusma_farms_super_secure_production_secret_key_2026';
const TOKEN_COOKIE_NAME = 'ragusma_token';

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

export function signToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    phone: user.phone || ''
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function signPasswordResetToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: 'password_reset'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyPasswordResetToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.type === 'password_reset') {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function getTokenFromRequest(req) {
  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check Cookie header
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    }).filter(([k]) => Boolean(k))
  );

  return cookies[TOKEN_COOKIE_NAME] || null;
}

export function getCurrentUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return {
    id: decoded.userId,
    fullName: decoded.fullName,
    email: decoded.email,
    phone: decoded.phone || '',
    role: decoded.role
  };
}

export function requireAuth(req) {
  const user = getCurrentUser(req);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireAdmin(req) {
  const user = requireAuth(req);
  if (user.role !== 'admin') {
    throw new Error('Unauthorized: Administrator privilege required');
  }
  return user;
}

export { TOKEN_COOKIE_NAME };

