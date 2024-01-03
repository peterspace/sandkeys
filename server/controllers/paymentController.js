const asyncHandler = require('express-async-handler');
const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.YOKASSA_SHOPID,
  secretKey: process.env.YOKASSA_SECRET_KEY,
});

// const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripePay1 = asyncHandler(async (req, res) => {
  let { amount, id } = req.body;

  const payment = await stripe.paymentIntents.create({
    amount: amount * 100, // convert to cents
    currency: 'USD',
    description: 'Crib Bookings',
    payment_method: id,
    confirm: true,
  });
  console.log('Payment', payment);
  res.json({
    message: 'Payment successful',
    success: true,
  });
});

const stripePay2 = asyncHandler(async (req, res) => {
  let { amount, id } = req.body;
  const successId = '1'; // new Idea

  const payment = await stripe.paymentIntents.create({
    amount: amount * 100, // convert to cents
    currency: 'USD',
    description: 'Crib Bookings',
    payment_method: id,
    confirm: true,
    return_url: `${process.env.FRONTEND_URL}/placePage/${successId}`,
  });

  // if (payment) {
  //   console.log('Payment', payment);
  //   const url = `${process.env.FRONTEND_URL}/placePage/${successId}`;
  //   res.redirect(url);
  // }
  console.log('Payment', payment);
  res.json({
    message: 'Payment successful',
    success: true,
  });
});

const stripePay = asyncHandler(async (req, res) => {
  let { amount, id, reservationId } = req.body;
  const successId = '1'; // new Idea
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency: 'USD',
      description: 'Crib Bookings',
      payment_method: id,
      confirm: true,
      // return_url: `${process.env.FRONTEND_URL}/placePage/${successId}`,
      return_url: `${process.env.FRONTEND_URL}/booking/${reservationId}/${successId}`,
    });
    console.log('Payment', payment);
    // res.json({
    //   message: 'Payment successful',
    //   success: true,
    // });

    console.log({ status: payment?.status });

    if (payment?.status === 'succeeded') {
      console.log({ status: payment?.status });
      res.json({
        message: 'Payment successful',
        success: true,
      });
    } else {
      res.json({
        message: 'Payment unsuccessful',
        success: false,
      });
    }
  } catch (error) {
    console.log('Error', error);
    res.json({
      message: 'Payment failed',
      success: false,
    });
    throw new Error(error);
  }
});

const createStripeCheckout = async (req, res) => {
  let { userId, cartItems } = req.body;
  const customer = await stripe.customers.create({
    metadata: {
      userId,
      cart: JSON.stringify(cartItems),
    },
  });

  const line_items = {
    price_data: {
      currency: 'usd',
      product_data: {
        name: cartItems.name,
        images: cartItems.images,
        description: cartItems.roomType, // check
        // description: 'Hotel reservation', // check
        metadata: {
          id: cartItems._id,
        },
      },
      unit_amount: cartItems.totalPrice * 100, // conversion to cents
    },
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ['card'],
    payment_method_types: ['card'],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: 'payment',
    customer: customer.id,
    success_url: `${process.env.FRONTEND_URL}/paySucess`,
    cancel_url: `${process.env.FRONTEND_URL}/payFailed`,
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
};

const createStripeSession = async (req, res) => {
  let { userId, cartItems } = req.body;
  const customer = await stripe.customers.create({
    metadata: {
      userId,
      cart: JSON.stringify(cartItems),
    },
  });

  const line_items = cartItems.map((product) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    mode: 'payment',
    customer: customer.id,
    line_items,
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Pickup in store',
        },
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/paySucess`,
    cancel_url: `${process.env.FRONTEND_URL}/payFailed`,
    // success_url: `http://localhost:3000/success`,
    // cancel_url: `http://localhost:3000/menu`,
  });

  // return {
  //   url: session.url || '',
  // }

  res.send({ url: session.url || '' });
};

//createPayment ===={Yokassa for yandex payements}=============================
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

module.exports = {
  stripePay,
  createStripeCheckout,
  createPayment,
};
