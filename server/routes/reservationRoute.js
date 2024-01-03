const express = require('express');
const router = express.Router();
const { protect, isAdmin, isPartner } = require('../middleWare/authMiddleware');
const {
  createReservation,
  getUserReservations,
  getOneUserReservation,
  getOwnerReservations,
  getOneOwnerReservation,
  getReservationsApproval,
  reservationNotificationOwner
} = require('../controllers/reservationController');

router.post('/', protect, createReservation);
router.get('/', protect, getUserReservations);
router.get('/:id', protect, getOneUserReservation);
router.get('/getOneOwnerReservation/:id', protect, getOneOwnerReservation);
router.get(
  '/getOwnerReservations/:ownerId',
  protect,
  isPartner,
  getOwnerReservations
);
router.post('/getReservationsApproval', getReservationsApproval);
router.post('/reservationNotificationOwner', reservationNotificationOwner);

//

module.exports = router;
