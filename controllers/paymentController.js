const asynHandler = require('express-async-handler');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

// const stripePay = asynHandler(async (req, res) => {
//   let { amount, id } = req.body;
//   try {
//     const payment = await stripe.paymentIntents.create({
//       amount,
//       currency: 'USD',
//       description: 'Crib Bookings',
//       payment_method: id,
//       confirm: true,
//     });
//     console.log('Payment', payment);
//     res.json({
//       message: 'Payment successful',
//       success: true,
//     });
//   } catch (error) {
//     console.log('Error', error);
//     res.json({
//       message: 'Payment failed',
//       success: false,
//     });
//     throw new Error(error);
//   }
// });

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

const createStripeCheckout1 = async (req, res) => {
  // app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    // mode: 'payment',
    // success_url: 'http://localhost:4242/success',
    // cancel_url: 'http://localhost:4242/cancel',
    mode: 'payment',
    success_url: `http://localhost:${process.env.PORT}/success`,
    cancel_url: `http://localhost:${process.env.PORT}/cancel`,
  });

  res.redirect(303, session.url);
};

// app.listen(4242, () => console.log(`Listening on port ${4242}!`));

// const createStripeCheckout2 = async (req, res) => {
//   let { amount, id } = req.body;
//   const customer = await stripe.customers.create({
//     metadata: {
//       userId: req.body.userId,
//       cart: JSON.stringify(req.body.cartItems),
//     },
//   });

//   const line_items = req.body.cartItems.map((item) => {
//     return {
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: item.name,
//           images: [item.image],
//           description: 'Accomadation bookings',
//           metadata: {
//             id: item.id,
//           },
//         },
//         unit_amount: item.price * 100, // conversion to cents
//         unit_amount: amount * 100,
//       },
//       quantity: 1,
//     };
//   });

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     shipping_address_collection: {
//       allowed_countries: ['US', 'CA', 'KE'],
//     },
//     shipping_options: [
//       {
//         shipping_rate_data: {
//           type: 'fixed_amount',
//           fixed_amount: {
//             amount: 0,
//             currency: 'usd',
//           },
//           display_name: 'Free shipping',
//           // Delivers between 5-7 business days
//           delivery_estimate: {
//             minimum: {
//               unit: 'business_day',
//               value: 5,
//             },
//             maximum: {
//               unit: 'business_day',
//               value: 7,
//             },
//           },
//         },
//       },
//       {
//         shipping_rate_data: {
//           type: 'fixed_amount',
//           fixed_amount: {
//             amount: 1500,
//             currency: 'usd',
//           },
//           display_name: 'Next day air',
//           // Delivers in exactly 1 business day
//           delivery_estimate: {
//             minimum: {
//               unit: 'business_day',
//               value: 1,
//             },
//             maximum: {
//               unit: 'business_day',
//               value: 1,
//             },
//           },
//         },
//       },
//     ],
//     phone_number_collection: {
//       enabled: true,
//     },
//     line_items,
//     mode: 'payment',
//     customer: customer.id,
//     success_url: `${process.env.CLIENT_URL}/checkout-success`,
//     cancel_url: `${process.env.CLIENT_URL}/cart`,
//   });

//   // res.redirect(303, session.url);
//   res.send({ url: session.url });
// };

const createStripeCheckout3 = async (req, res) => {
  let { amount, roomType, id, userId } = req.body;

  const customer = await stripe.customers.create({
    metadata: {
      userId,
      roomType,
      // cart: JSON.stringify(req.body.cartItems),
    },
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Hotel Reservations',
            description: roomType,
          },
          unit_amount: amount * 100, // conversion to cents in usd
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer: customer.id,
    success_url: `${process.env.FRONTEND_URL}/checkout-success`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
};

// const createStripeCheckout = async (req, res) => {
//   let { userId, cartItems } = req.body;
//   const customer = await stripe.customers.create({
//     metadata: {
//       userId,
//       cart: JSON.stringify(cartItems),
//     },
//   });

//   const line_items = cartItems.map((item) => {
//     return {
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: item.name,
//           // images: [item.image],
//           // description: item.roomType, // check
//           description: 'Hotel reservation', // check
//           metadata: {
//             id: item._id,
//           },
//         },
//         unit_amount: item.totalPrice * 100, // conversion to cents
//       },
//       quantity: 1,
//     };
//   });

//   const session = await stripe.checkout.sessions.create({
//     // payment_method_types: ['card'],
//     payment_method_types: ['card'],
//     phone_number_collection: {
//       enabled: true,
//     },
//     line_items,
//     mode: 'payment',
//     customer: customer.id,
//     success_url: `${process.env.FRONTEND_URL}/paySucess`,
//     cancel_url: `${process.env.FRONTEND_URL}/payFailed`,
//   });

//   // res.redirect(303, session.url);
//   res.send({ url: session.url });
// };

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
