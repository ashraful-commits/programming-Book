import { validator } from '../utility/validator.js';
import { userModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const pageRedirect = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (token) {
      const tokenCheck = await jwt.verify(
        token,
        process.env.JWT_SECRECT
      );
      console.log(token);
      console.log(tokenCheck);
      if (tokenCheck) {
        const validData = await userModel.findById({
          _id: tokenCheck.id,
        });
        console.log(validData);
        if (validData) {
          next();
        } else {
          delete req.session.user;
          res.clearCookie('authToken');
          validator('Registration Please!', '/login', req, res);
        }
      }
    } else {
      delete req.session.user;
      res.clearCookie('authToken');
      validator('Please login !', '/login', req, res);
    }
  } catch (error) {
    delete req.session.user;
    res.clearCookie('authToken');
    validator('Invalid token', '/login', req, res);
  }
};
