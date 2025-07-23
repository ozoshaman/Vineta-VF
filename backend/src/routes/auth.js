const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authmiddleware');
const { 
  getProfile, 
  updateProfile, 
  getPublicProfile, 
  getUserPostsController, 
  getUserFollowersController, 
  getUserFollowingController,
  followUserController,
  isFollowingController,
  getFullPublicProfileController // importar nuevo controlador
} = require('../controllers/configPerfil');
const {
  registerUser, loginUser,
  changePassword, deleteAccount, updateAvatar,
  verifyCode, resendCode,forgotPassword,resetForgottenPassword
} = require('../controllers/authController');
const { getFeed,createNewPost,getMyPosts } = require('../controllers/feedController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/password', authenticate, changePassword);
router.delete('/profile', authenticate, deleteAccount);
router.post('/profile/avatar', authenticate, upload.single('avatar'), updateAvatar);
router.post('/verify', verifyCode);
router.post('/resend-code', resendCode);
// En routes/auth.js o donde estén tus rutas de auth
router.post('/forgot-password', forgotPassword); // Usuario solicita código
router.put('/reset-password', resetForgottenPassword); // Usuario cambia contraseña con código

//----PERFIL------
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

//----PERFIL PÚBLICO------
router.get('/user/:author_id', authenticate, getPublicProfile);
router.get('/user/:author_id/full', authenticate, getFullPublicProfileController); // nueva ruta
router.get('/user/:author_id/posts', authenticate, getUserPostsController);
router.get('/user/:author_id/followers', authenticate, getUserFollowersController);
router.get('/user/:author_id/following', authenticate, getUserFollowingController);

//----SEGUIR USUARIO------
router.post('/user/:author_id/follow', authenticate, followUserController);
router.get('/user/:author_id/is-following', authenticate, isFollowingController); 

//----Feed--------
router.get('/feed', authenticate, getFeed);
router.post('/create', authenticate, createNewPost);
router.get('/mine', authenticate, getMyPosts);


module.exports = router;
