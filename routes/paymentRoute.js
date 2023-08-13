const express = require('express');
const {
  stripePay,
  createStripeCheckout,
} = require('../controllers/paymentController');
const router = express.Router();

router.post('/stripCheckout', stripePay);

router.post('/create-checkout-session', createStripeCheckout);

module.exports = router;
