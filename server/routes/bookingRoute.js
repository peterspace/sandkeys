const express = require('express');
const router = express.Router();
const { protect, isAdmin, isPartner } = require('../middleWare/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getOneUserBooking,
  getOneOwnerBooking,
  getOwnerBookings,
  updateOwnerBooking,
  updateBookingsAutomatically,
  getAllBookings,
  getAllBookingsByOwner,

  //=============================

  getAllCompletedBookings,
  getAllInactiveBookings,
  getAllActiveBookings,
  getAllPendingBookings,
  getAllPaidBookings,
  getAllCanceledBookings,
  bookingConfirmation,
  paymentConfirmation,
  createYandexPay,
  authSucessYandex,
  getYandexPayment,
  getBookingApproval,
  bookingNotificationOwner,
  bookingNotificationUser,
  getRoomsByBookingDate,
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.post('/bookingConfirmation', bookingConfirmation);
router.post('/paymentConfirmation', paymentConfirmation);
router.get('/', protect, getUserBookings); // modified
router.put('/', protect, isPartner, updateOwnerBooking); // by owner/admin only
router.put('/updateBookingStatus', updateBookingsAutomatically); // by system
// router.patch("/", updateOwnerBooking); // by owner/admin only

router.get('/:id', protect, getOneUserBooking); // modified
router.get('/getOneOwnerBooking/:id', protect, getOneOwnerBooking); // modified
//
// router.get("/ownerbookings", protect, getOwnerBookings); // modified
router.get('/ownerbookings/:ownerId', protect, isPartner, getOwnerBookings); // modified
router.get('/allbookings', protect, getAllBookings); // modified
router.get(
  '/allbookingsbyowner/:ownerId',
  protect,
  isPartner,
  getAllBookingsByOwner
); // modified

//============================={Get status}==============================================
router.get('/getAllCompletedBookings/:ownerId', getAllCompletedBookings); // modified
router.get('/getAllInactiveBookings/:ownerId', getAllInactiveBookings); // modified
router.get('/getAllActiveBookings/:ownerId', getAllActiveBookings); // modified
router.get('/getAllPendingBookings/:ownerId', getAllPendingBookings); // modified
router.get('/getAllPaidBookings/:ownerId', getAllPaidBookings); // modified
router.get('/getAllCanceledBookings/:ownerId', getAllCanceledBookings); // modified
// router.post('/payment/yandex/createYandexPay', createYandexPay);
router.post('/createYandexPay', createYandexPay);
router.get('/authSucessYandex', authSucessYandex);
router.get('/getYandexPayment/:paymentId', getYandexPayment);
router.post('/getBookingApproval', getBookingApproval);
router.post('/bookingNotificationOwner', bookingNotificationOwner);
router.post('/bookingNotificationUser', bookingNotificationUser);
router.get('/getRoomsByBookingDate/:roomId', getRoomsByBookingDate); // modified

//

//getYandexPayment

// updateOwnerBooking
module.exports = router;
