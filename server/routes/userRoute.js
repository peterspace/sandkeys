const express = require('express');

const { rateLimit } = require('express-rate-limit');

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  findUser,

  //=============================================

  registerAgent,
  registerAdmin,

  //==========={Admin Only}======================
  getAllUsers,
  getAllAgents,
  getAllAdmins,

  //======={New}========================

  getWishlist,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
  loginByGoogle,
  loginByFacebook,
  registerSocial,
  loginSocial,
  authSucessGoogle,
  authErrorGoogle,
  authSucessFacebook,
  authErrorFacebook,
  forgotOtp,
  verifyOtp,
} = require('../controllers/userController');
// const protect = require('../middleWare/protect');

const protect = require('../middleWare/adminMiddleware');
router.post('/register', limiter, registerUser);
router.post('/registerSocial', limiter, registerSocial);
router.post('/login', loginUser);
router.post('/loginSocial', loginSocial);
router.get('/authSucessGoogle', authSucessGoogle);
router.get('/authErrorGoogle', authErrorGoogle);
router.get('/authSucessFacebook', authSucessFacebook);
router.get('/authErrorFacebook', authErrorFacebook);

router.get('/logout', logout);
router.get('/getuser', protect, getUser);
router.get('/loggedin', loginStatus);
router.patch('/updateuser', protect, updateUser);
router.patch('/changepassword', protect, changePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.get('/findUser', protect, findUser);

//==============================================

router.post('/register/partner', registerAgent);
router.post('/register/admin', registerAdmin);

//==========={Admin Only}======================

router.get('/getAllUsers', protect, getAllUsers);
router.get('/getAllAgents', protect, getAllAgents);
router.get('/getAllAdmins', protect, getAllAdmins);

router.post('/cart', protect, userCart);
router.post('/cart/applycoupon', protect, applyCoupon);
router.post('/cart/cash-order', protect, createOrder);
router.get('/get-orders', protect, getOrders);
router.get('/getallorders', protect, getAllOrders);
router.post('/getorderbyuser/:id', protect, getAllOrders);
router.get('/wishlist', protect, getWishlist);
router.get('/cart', protect, getUserCart);
router.delete('/empty-cart', protect, emptyCart);
router.put(
  '/order/update-order/:id',
  protect,
  // isAdmin,
  updateOrderStatus
);

router.get('/getOrderByUserId/:id', getOrderByUserId);
router.get('/loginByGoogle', loginByGoogle);
router.get('/loginByFacebook', loginByFacebook);
router.post('/forgotOtp', forgotOtp);
router.post('/verifyOtp', verifyOtp);

module.exports = router;
