import { validator } from '../utility/validator.js';
import swal from 'sweetalert';
import { checkEmail } from '../utility/emailCheck.js';
import { userModel } from '../models/userModel.js';
import { makeHash } from '../utility/hash.js';
import { makeToken } from '../utility/token.js';
import { sendAMail } from '../utility/email.js';
import { verifyToken } from '../utility/verifyToken.js';
import { passCompare } from '../utility/passCompare.js';
import fs from 'fs';
import { send } from 'process';
import { now } from 'mongoose';

//================================= home page
export const homePage = (req, res) => {
  res.render('index');
};
//================================= profile page
export const profilePage = (req, res) => {
  const user = req.session.user;
  res.render('profile', {
    user,
  });
};
//================================= home page
export const editPage = (req, res) => {
  res.render('edit');
};
//================================= password page
export const passwordPage = (req, res) => {
  res.render('password');
};
//================================= gallery page
export const galleryPage = (req, res) => {
  const user = req.session.user;
  res.render('gallery', {
    user,
  });
};
//================================= friends page
export const friendsPage = async (req, res) => {
  const allFriends = await userModel
    .find()
    .where({ email: { $ne: req.session.user.email } });
  res.render('friends', {
    friends: allFriends,
  });
};
//================================= signup page
export const signupPage = (req, res) => {
  res.render('signup');
};
//================================= login page
export const loginPage = (req, res) => {
  res.render('login');
};
//================================= profile photo page
export const pofilePhotoPage = (req, res) => {
  const user = req.session.user;
  res.render('photo', {
    user,
  });
};

///////////////////////////======== action start =======================///////////////

export const userSignUp = async (req, res) => {
  try {
    const { name, email, cell, location, password } = req.body;
    if (!name || !email || !cell || !location || !password) {
      validator('All fields are required', '/signup', req, res);
    } else {
      const check = await checkEmail(email);
      if (check) {
        validator('Email already exist !', '/signup', req, res);
      } else {
        const user = await userModel.create({
          name,
          email,
          cell,
          password: await makeHash(password),
          location,
          isActive: false,
        });
        const token = makeToken({ id: user._id }, '3d');
        const link = `${process.env.APP_LINK}:${process.env.PORT}/active/${token}`;
        await sendAMail(email, {
          name,
          cell,
          link,
          status: 'verify',
        });
        validator('SignUp successfully Done !', '/login', req, res);
      }
    }
  } catch (error) {
    validator(error.message, '/signup', req, res);
  }
};
//==================================================active User
export const activeUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      validator('User is Not valid', '/login', req, res);
    } else {
      const checkToken = verifyToken(token);
      console.log(checkToken);
      if (checkToken) {
        await userModel.findByIdAndUpdate(
          { _id: checkToken.id },
          {
            isActive: true,
          }
        );
        validator(
          'Account Actived Successfully!',
          '/login',
          req,
          res
        );
      } else {
        validator('User not Valid !', '/login', req, res);
      }
    }
  } catch {
    validator(error.message, '/login', req, res);
  }
};
//==========================================================> login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      validator('All fields are required !', '/login', req, res);
    } else {
      const findUser = await checkEmail(email);
      if (!findUser) {
        validator('Please Signup!', '/login', req, res);
      } else {
        if (findUser.isActive) {
          const passComp = passCompare(password, findUser.password);

          if (passComp) {
            req.session.user = findUser;
            const token = makeToken({ id: findUser._id }, '4d');
            console.log(token);
            res.cookie('authToken', token);
            validator('', '/', req, res);
          } else {
            validator('Password not Match', '/login', req, res);
          }
        } else {
          validator('Please Active Account!', '/login', req, res);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    validator(error.message, '/login', req, res);
  }
};

//================================================ follow friends
export const followFriend = async (req, res) => {
  try {
    const { id } = req.params;

    await userModel.findByIdAndUpdate(req.session.user._id, {
      $push: {
        following: id,
      },
    });
    await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          followers: req.session.user._id,
        },
      }
    );
    req.session.user.following.push(id);
    validator('Successfully followed!', '/friends', req, res);
  } catch (error) {
    validator(error.message, '/friends', req, res);
  }
};

//==============================unfollow
export const unFollowFriend = async (req, res) => {
  try {
    const { id } = req.params;

    await userModel.findByIdAndUpdate(req.session.user._id, {
      $pull: {
        following: id,
      },
    });
    await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          followers: req.session.user._id,
        },
      }
    );
    const updateFollowing = req.session.user.following.filter(
      (data) => {
        data._id != id;
      }
    );
    req.session.user.following = updateFollowing;
    validator('Successfully followed!', '/friends', req, res);
  } catch (error) {
    validator(error.message, '/friends', req, res);
  }
};

//============================================ following frends
export const followingPage = async (req, res) => {
  try {
    const { id } = req.params;
    const followingUser = await userModel
      .findById({ _id: id })
      .populate('following');
    res.render('following', {
      followinguser: followingUser,
    });
    req.session.user = req.session.user;
  } catch (error) {
    validator(error.message, '/profile', req, res);
  }
};

//============================================ following frends
export const followerPage = async (req, res) => {
  try {
    const { id } = req.params;
    const followerUser = await userModel
      .findById({ _id: id })
      .populate('followers');
    res.render('followers', {
      followersuser: followerUser,
    });
    req.session.user = req.session.user;
  } catch (error) {
    validator(error.message, '/profile', req, res);
  }
};

//======================================logout
export const userLogout = (req, res) => {
  delete req.session.user;
  res.clearCookie('authToken');
  validator('Logout Successfully done!', '/login', req, res);
};

//======================================== profile photo upload
export const profilePhoto = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.session.user._id, {
      photo: req.file.filename,
    });
    req.session.user.photo = req.file.filename;
    validator('Photo uploaded !', '/photo', req, res);
  } catch (error) {
    validator(error.message, '/photo', req, res);
  }
};

//================================= update profile
export const UpdateProfile = async (req, res) => {
  try {
    const { name, email, cell, location } = req.body;
    if (!name || !email || !cell || !location) {
      validator('All fields are required', '/edit', req, res);
    } else {
      const updateProfile = await userModel.findByIdAndUpdate(
        req.session.user._id,
        {
          name,
          email,
          cell,
          location,
        }
      );
      req.session.user = updateProfile;
      validator('profile updated', '/login', req, res);
    }
  } catch (error) {
    validator(error.message, '/edit', req, res);
  }
};

//======================================change password

export const passwordChange = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;
    if (!old_password || !new_password || !confirm_password) {
      validator('All fields are required', '/password', req, res);
    } else {
      const userId = await userModel.findById(req.session.user._id);
      const checkPass = passCompare(old_password, userId.password);
      if (!checkPass) {
        validator('Password not match', '/password', req, res);
      } else {
        await userModel.findByIdAndUpdate(req.session.user._id, {
          password: await makeHash(new_password),
        });
        validator('Password Updated!', '/login', req, res);
      }
    }
  } catch (error) {
    validator(error.message, '/password', req, res);
  }
};

//============================== gallery photo upload
export const galleryPhotoUpload = async (req, res) => {
  try {
    const gall = [];

    req.files.forEach((element) => {
      gall.push(element.filename);
      req.session.user.gallery.push(element.filename);
    });

    const updateWithGallary = await userModel.findByIdAndUpdate(
      req.session.user._id,
      {
        $push: { gallery: { $each: gall } },
      }
    );
    console.log(updateWithGallary.gallery[0]);

    validator('Gallery Uploaded', '/gallery', req, res);
  } catch (error) {
    validator(error.message, '/gallery', req, res);
  }
};

//==========================================// image delete

export const galleryPhotoDelet = async (req, res) => {
  //   const { path } = req.params;
  //   const imgpath = `../public/images/${path}`;
  //   console.log(imgpath);
  //   fs.unlinkSync(imgpath);
  //   validator('File deleted!', '/gallery', req, res);
};

export const forgetPage = (req, res) => {
  res.render('forgetpage');
};

//============================= send reset mail
export const passResetMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      validator('Please give a email !');
    } else {
      const userEmail = await userModel
        .findOne()
        .where('email')
        .equals(email);
      if (!userEmail) {
        validator('Email not Valid!', '/forgetpage', req, res);
      } else {
        const token = makeToken({ id: userEmail._id }, '5d');
        const link = `${process.env.APP_LINK}:${process.env.PORT}/resetpass/${token}`;
        await sendAMail(email, {
          name: userEmail.name,
          cell: userEmail.cell,
          link: link,
          status: 'reset',
        });
        validator(
          'Check mail Reset password',
          '/forgetpage',
          req,
          res
        );
      }
    }
  } catch (error) {
    validator(error.message, '/forgetpage', req, res);
  }
};

//=========================== reset password

export const resetPage = (req, res) => {
  const { token } = req.params;
  res.render('resetpassword', { token: token });
};

export const resetpassword = async (req, res) => {
  const { token } = req.params;
  try {
    const checkTokenTwo = verifyToken(token);
    console.log(checkTokenTwo);
    if (!checkTokenTwo) {
      validator('/Token not Valid', `/resetpass/${token}`, req, res);
    } else {
      const { new_password, comp_password } = req.body;
      if (!new_password || !comp_password) {
        validator(
          'All fields are required!',
          `/resetpass/${token}`,
          req,
          res
        );
      } else if (new_password != comp_password) {
        validator(
          'Password not Match',
          `/resetpass/${token}`,
          req,
          res
        );
      } else {
        await userModel.findByIdAndUpdate(checkTokenTwo.id, {
          password: await makeHash(new_password),
        });
        console.log(checkTokenTwo.id);
        validator(
          'Password reseted Successfully!',
          '/login',
          req,
          res
        );
      }
    }
  } catch (error) {
    validator(error.message, `/resetpass/${token}`, req, res);
  }
};

//===========================================friend profile

export const friendsProfle = async (req, res) => {
  const { id } = req.params;
  const friendData = await userModel.findById({ _id: id });
  res.render('profile', {
    user: friendData,
  });
};
