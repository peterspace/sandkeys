const express = require('express');
const {
  stripePay,
  createStripeCheckout,
  createPayment,
} = require('../controllers/paymentController');
const router = express.Router();
router.post('/stripCheckout', stripePay);
router.post('/create-checkout-session', createStripeCheckout);
router.post('/createPayment', createPayment);

module.exports = router;
