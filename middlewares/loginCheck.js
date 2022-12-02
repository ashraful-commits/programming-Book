import { validator } from '../utility/validator.js';

export const loginCheck = (req, res, next) => {
  const token = req.session.authToken;
  if (token) {
    validator('', '/', req, res);
  } else {
    next();
  }
};
