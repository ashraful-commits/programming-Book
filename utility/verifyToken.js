import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  const checkToken = jwt.verify(token, process.env.JWT_SECRECT);
  return checkToken;
};
