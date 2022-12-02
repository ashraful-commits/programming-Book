import express from 'express';
import {
  activeUser,
  editPage,
  friendsPage,
  galleryPage,
  homePage,
  loginPage,
  passwordPage,
  pofilePhotoPage,
  profilePage,
  signupPage,
  userSignUp,
  loginUser,
  followFriend,
  unFollowFriend,
  followingPage,
  userLogout,
  followerPage,
  profilePhoto,
  UpdateProfile,
  passwordChange,
  galleryPhotoUpload,
  forgetPage,
  passResetMail,
  resetPage,
  resetpassword,
  friendsProfle,
  // galleryPhotoDelet,
} from '../controllers/pageControllers.js';
import { loginCheck } from '../middlewares/loginCheck.js';
import { galleryMulter, photoMulter } from '../middlewares/multer.js';
import { pageRedirect } from '../middlewares/pageRedirect.js';

//============================= create Rouer
export const router = express.Router();

//=========================== home page show
router.route('/').get(pageRedirect, homePage);
router.route('/profile').get(pageRedirect, profilePage);
router.route('/profile/:id').get(friendsProfle);
router.route('/edit').get(pageRedirect, editPage).post(UpdateProfile);
router.route('/friends').get(pageRedirect, friendsPage);
router
  .route('/photo')
  .get(pageRedirect, pofilePhotoPage)
  .post(photoMulter, profilePhoto);
router
  .route('/gallery')
  .get(pageRedirect, galleryPage)
  .post(galleryMulter, galleryPhotoUpload);
router
  .route('/password')
  .get(pageRedirect, passwordPage)
  .post(passwordChange);
router.route('/signup').get(loginCheck, signupPage).post(userSignUp);
router.route('/active/:token').get(activeUser);
router.route('/login').get(loginCheck, loginPage).post(loginUser);
router.route('/follow/:id').get(followFriend);
router.route('/unfollow/:id').get(unFollowFriend);
router.route('/following/:id').get(followingPage);
router.route('/followers/:id').get(followerPage);
router.route('/logout').get(userLogout);
// router.route('/images/:path').get(galleryPhotoDelet);
router.route('/forgetpage').get(forgetPage).post(passResetMail);
router.route('/resetpass/:token').get(resetPage).post(resetpassword);
