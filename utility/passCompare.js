import bcrypt from 'bcryptjs';

export const passCompare = (password, compPass) => {
  const comPassWord = bcrypt.compareSync(password, compPass);
  return comPassWord;
};
