const asynHandler = require('express-async-handler');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const stripePay = asynHandler(async (req, res) => {
  let { amount, id } = req.body;
  try {
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
  } catch (error) {
    console.log('Error', error);
    res.json({
      message: 'Payment failed',
      success: false,
    });
    throw new Error(error);
  }
});

// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

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

module.exports = {
  stripePay,
  createStripeCheckout,
};
