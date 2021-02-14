import jwt from 'jsonwebtoken';

const secret = process.env['JWT_SECRET']
if (secret === undefined || secret.length === 0) {
  console.error('ERROR: Missing JWT_SECRET environment variable.');
  process.exit(2);
}

export function signToken(claims) {
  if (!Number.isInteger(claims.exp)) {
    claims.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
  }
  return jwt.sign(claims, secret);
}

export function verifyToken(token) {
  return jwt.verify(token, secret);
}

export function decodeToken(token) {
  return jwt.decode(token, secret);
}

export default {
  signToken,
  verifyToken,
  decodeToken
}