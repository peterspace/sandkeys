const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv').config();

const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.YOKASSA_SHOPID,
  secretKey: process.env.YOKASSA_SECRET_KEY,
});

//createPayment
//https://yookassa.ru/developers/api#create_payment
const createPayment = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { amount, currency, paymentMethod, description } = req.body;

  console.log({ amount: amount });
  const payment = await yooKassa.createPayment({
    amount: {
      value: amount,
      currency,
    },
    payment_method_data: {
      type: paymentMethod,
    },
    confirmation: {
      type: 'redirect',
      // return_url: 'https://yookassa.ru/',
      return_url: 'http://localhost:5173/paySuccess',
      // return_url: "https://www.merchant-website.com/return_url"
    },
    description,
  });

  if (payment) {
    res.json(payment);
  }
});

// payment_id = '215d8da0-000f-50be-b000-0003308c89be'
//payment information
//https://yookassa.ru/developers/api#get_payment
const getPayment = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { payment_id } = req.body;

  console.log({ amount: amount });
  const payment = await yooKassa.getPayment({
    payment_id: payment_id,
  });

  if (payment) {
    res.json(payment);
  }
});

//payment information
//https://yookassa.ru/developers/api#capture_payment
const capturePayment = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { payment_id, amount, currency, paymentMethod, description } = req.body;

  console.log({ amount: amount });
  const payment = await yooKassa.capturePayment({
    payment_id,
    amount: {
      value: amount,
      currency,
    },
  });

  if (payment) {
    res.json(payment);
  }
});

//payment information
//https://yookassa.ru/developers/api#capture_payment
const cancelPayment = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { payment_id } = req.body;

  const payment = await yooKassa.cancelPayment({
    payment_id,
  });

  if (payment) {
    res.json(payment);
  }
});

//payment information
//https://yookassa.ru/developers/api#create_refund
const createRefund = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { payment_id, amount, currency } = req.body;

  console.log({ amount: amount });
  const refund = await yooKassa.createRefund({
    amount: {
      value: amount,
      currency,
    },
    payment_id,
  });

  if (refund) {
    res.json(refund);
  }
});

//refund
//https://yookassa.ru/developers/api#get_refund
const getRefund = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { refund_id } = req.body;

  const refund = await yooKassa.getRefund({
    refund_id: refund_id,
  });

  if (refund) {
    res.json(refund);
  }
});
