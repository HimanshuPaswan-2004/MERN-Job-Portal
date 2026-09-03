import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.SECRET_KEY || process.env.JWT_SECRET || 'secret123';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
