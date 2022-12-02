import { userModel } from '../models/userModel.js';

export const checkEmail = async (email) => {
  const check = await userModel
    .findOne()
    .where('email')
    .equals(email);
  return check;
};
