const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv').config();

const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;
const User = require('../models/UserModel');

const Booking = require('../models/BookingModel');
const Place = require('../models/PlaceModel');
const sendEmail = require('../utils/sendEmail');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// const createBooking = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id); // get userId from "protect middleware"
//   const { place, checkIn, checkOut, numberOfGuests, name, phone, price, paymentMethod} =
//     req.body;
//   const newBooking = new Booking({
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//     paymentMethod,
//     user: user._id

//   });

//   const savedBooking = await newBooking.save();

//   if (!savedBooking) {
//     res.status(400).json({ message: 'booking unsucessful' });
//   }
//   console.log('booking:', savedBooking);
//   res.json(savedBooking);
// });

const createBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const {
    place,
    room,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    numberOfNights,
    price,
    totalPrice,
    paymentMethod,
    owner,
  } = req.body;
  const newBooking = new Booking({
    place,
    room,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    numberOfNights,
    price,
    totalPrice,
    paymentMethod,
    user: user._id,
    owner,
  });

  const savedBooking = await newBooking.save();

  if (!savedBooking) {
    res.status(400).json({ message: 'booking unsucessful' });
  }
  console.log('booking:', savedBooking);
  res.json(savedBooking);
});

/**========================Booking Status============================
 * pending
 * active
 * completed
 *
 * paid
 * cancel
 */

//==================================={User Only}=======================================================

// const createBooking = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id); // get userId from "protect middleware"

//   const {
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//     paymentMethod,
//   } = req.body;

//   const userPlace = Place.findById(place); // place is place._id "using ObjectId"
//   const owner = userPlace.owner;
//   const newBooking = new Booking({
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//     paymentMethod,
//     user: user._id,
//     owner, // owner of the property
//     status: 'pending', //: update booking status: "pending"
//   });

//   const savedBooking = await newBooking.save();

//   //========={Update place availability}
//   userPlace.isAvailable = false;
//   await userPlace.save();

//   if (!savedBooking) {
//     res.status(400).json({ message: 'booking unsucessful' });
//   }
//   console.log('booking:', savedBooking);
//   res.json(savedBooking);
// });

// Get all UserBookings
const getUserBookings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // res.json(await Booking.find({ user: user._id }).populate('room'));
  res.json(await Booking.find({ user: user._id }).populate('room'));
});

// Get all UserBookings
const getOneUserBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { id } = req.params;

  res.json(await Booking.findOne({ user: user._id, _id: id }).populate('room'));
});

//==================================={Owner Only}=======================================================

// Get all OwnerBookings

// Get all OwnerBookings
const getOwnerBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  res.json(await Booking.find({ owner: ownerId }).populate('room'));
});

// const getUserPlaces = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   res.json(await Place.find({ owner: user._id }));
// });

//==================================={Owner &  Admin Only}=======================================================

// only give access to modify status, name, checkout "incase the user needs to spend more days" and paymentMethod incase the user wishes to use another payment method after extending stay or ask for rebooking
// const updateOwnerBooking = asyncHandler(async (req, res) => {
//   const activeUser = await User.findById(req.user._id); // get userId from "protect middleware"
//   const userId = activeUser._id;
//   const {
//     id, // booking id,
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//     paymentMethod,
//     user,
//     owner, // owner of the property
//     status, // "Paid, Cancel"
//   } = req.body;
//   const bookingDoc = await Booking.findById(id);
//   if (activeUser.role === 'Admin' || userId === bookingDoc.owner.toString()) {
//     bookingDoc.set({
//       place,
//       checkIn,
//       checkOut,
//       numberOfGuests,
//       name,
//       phone,
//       price,
//       paymentMethod,
//       user,
//       owner, // owner of the property
//       status,
//     });
//     await bookingDoc.save();
//     res.json('ok');
//   }
// });

// const updateOwnerBooking = asyncHandler(async (req, res) => {
//   const { userId, bookingId, status } = req.body;

//   const bookingDoc = await Booking.findOne({
//     _id: bookingId,
//     owner: userId,
//   }).exec();

//   bookingDoc.status = status;
//   await bookingDoc.save();

//   res.json('ok');
// });

// const updateOwnerBooking = asyncHandler(async (req, res) => {
//   const { userId, placeId, bookingId, status } = req.body;

//   const bookingDoc = await Booking.findOne({
//     _id: bookingId,
//     place: placeId,
//   }).exec();

//   const user = User.find(userId)

//   if (user.role === 'Admin' || userId === bookingDoc.owner.toString()) {
//     bookingDoc.status = status;
//     await bookingDoc.save();
//   }

//   res.json('ok');
// });

// const updateOwnerBooking = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id); // get userId from "protect middleware"
//   const userId = user._id;
//   const {
//     id, // new
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//     paymentMethod,
//     owner,
//     status, // new update
//   } = req.body;

//   const bookingDoc = await Booking.findById(id);
//   if (user.role === 'Admin' || userId === bookingDoc.owner.toString()) {
//     bookingDoc.set({
//       place,
//       checkIn,
//       checkOut,
//       numberOfGuests,
//       name,
//       phone,
//       price,
//       paymentMethod,
//       owner,
//       status,
//     });
//     await bookingDoc.save();

//     const placeDoc = Place.findById(place);
//     console.log("place",  placeDoc)
//     if (placeDoc) {
//       // const { isAvailable } = placeDoc;
//     }
//     if (status === 'Paid') {
//       placeDoc.isAvailable = false || placeDoc.isAvailable;

//       // await placeDoc.save()
//     }

//     if (status === 'Cancel') {
//       placeDoc.isAvailable = true || placeDoc.isAvailable;
//       // await placeDoc.save()
//     }

//     const updatedPlace = await placeDoc.save();
//     console.log('updatedPlace:', updatedPlace);

//     res.json('ok');
//   }
// });

const updateOwnerBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const userId = user._id;
  const {
    id, // new
    place,
    room,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    numberOfNights,
    price,
    totalPrice,
    paymentMethod,
    owner,
    status, // new update
  } = req.body;

  const bookingDoc = await Booking.findById(id);
  if (user.role === 'Admin' || userId === bookingDoc.owner.toString()) {
    bookingDoc.set({
      place,
      room,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      numberOfNights,
      price,
      totalPrice,
      paymentMethod,
      owner,
      status,
    });
    await bookingDoc.save();

    // const placeDoc = Place.findById(place);
    // console.log("place",  placeDoc)

    // const { isAvailable } = placeDoc;
  }
  if (status === 'Paid') {
    await Place.findOneAndUpdate({ _id: place }, { isAvailable: false });
  }

  if (status === 'Cancel') {
    await Place.findOneAndUpdate({ _id: place }, { isAvailable: true });
  }

  res.json('ok');
});

const updateBookingsAutomatically = asyncHandler(async (req, res) => {
  const {
    id, // new
    place,
    room,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    numberOfNights,
    price,
    totalPrice,
    paymentMethod,
    owner,
    status, // new update
  } = req.body;

  const bookingDoc = await Booking.findById(id);

  bookingDoc.set({
    place,
    room,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    numberOfNights,
    price,
    totalPrice,
    paymentMethod,
    owner,
    status,
  });
  await bookingDoc.save();

  if (status === 'Paid') {
    await Place.findOneAndUpdate({ _id: place }, { isAvailable: false });
  }

  if (status === 'Cancel') {
    await Place.findOneAndUpdate({ _id: place }, { isAvailable: true });
  }

  res.json('ok');
});

//==================================={Admin Only}=======================================================

// Admin only function
const getAllBookings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role === 'Admin') {
    res.json(await Booking.find().populate('room'));
  }
});

const getAllBookingsByOwner = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { ownerId } = req.params;
  if (user.role === 'Admin') {
    res.json(await Booking.find({ owner: ownerId }).populate('room'));
  }
});

//==================================={Completed Bookings}=======================================================
const getAllCompletedBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;

  const userBookings = await Booking.find({ owner: ownerId }).populate('room');
  let userBooks = [];

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    let status = booking.status;
    // let status = userBookings[i].status
    if (status === 'Completed') {
      // booking = userBookings[i];
      userBooks.push(booking);
    }
  }

  res.json(userBooks);

  // res.json(await Place.find({ city: city, type: type, isAvailable:true }));
});

//==================================={Active Bookings}=======================================================
// const getAllActiveBookings = asyncHandler(async (req, res) => {
//   const { ownerId } = req.params;

//   const userBookings = await Booking.find({ owner: ownerId }).populate('room');
//   let userBooks = [];

//   for (let i = 0; i < userBookings.length; i++) {
//     if (userBookings[i].status === 'Active') {
//       userBooks.push(userBookings);
//     }
//   }

//   res.json(userBooks);
// });

//==================================={Pending Bookings}=======================================================
const getAllPendingBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;

  const userBookings = await Booking.find({ owner: ownerId }).populate('room');
  let userBooks = [];

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    let status = booking.status;
    // let status = userBookings[i].status
    if (status === 'Pending') {
      // booking = userBookings[i];
      userBooks.push(booking);
    }
  }

  res.json(userBooks);
});

//==================================={Paid Bookings}=======================================================
const getAllPaidBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;

  const userBookings = await Booking.find({ owner: ownerId }).populate('room');
  let userBooks = [];

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    let status = booking.status;
    // let status = userBookings[i].status
    if (status === 'Paid') {
      // booking = userBookings[i];
      userBooks.push(booking);
    }
  }

  res.json(userBooks);
});

//==================================={Canceled Bookings}=======================================================
const getAllCanceledBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;

  const userBookings = await Booking.find({ owner: ownerId }).populate('room');
  let userBooks = [];

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    let status = booking.status;
    // let status = userBookings[i].status
    if (status === 'Completed') {
      // booking = userBookings[i];
      userBooks.push(booking);
    }
  }

  res.json(userBooks);
});

//==================================={Active Bookings}=======================================================
const getAllActiveBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;

  const userBookings = await Booking.find({ owner: ownerId }).populate('room');
  let userBooks = [];

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    let status = booking.status;
    // let status = userBookings[i].status
    if (status === 'Active') {
      // booking = userBookings[i];
      userBooks.push(booking);
    }
  }

  res.json(userBooks);
});

const bookingConfirmation = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User does not exist');
  }

  const subject = 'Booking Confirmation';

  // Delete token if it exists in DB

  // Reset Email
  const message = `
<h2>Hello ${name}</h2>
<p>Thank you for choosing Crib.com</p>  
<p>Your booking was sucessful. Please hold while we process your payment.</p>
<p>All payments confirmation takes an average of 30minutes.</p>

<p>Regards...</p>
<p>Crib Team</p>
`;

  const emailTest = 'peter.space.io@gmail.com';

  // const send_to = email;
  const send_to = emailTest;
  const sent_from = process.env.EMAIL_USER;

  // console.log({ email: email, name: user?.name });

  await sendEmail(subject, message, send_to, sent_from);
  res
    .status(200)
    .json({ success: true, message: 'your booking was sucessful' });
});

const paymentConfirmation = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User does not exist');
  }

  // Delete token if it exists in DB

  const userProfile = `${process.env.FRONTEND_URL}/account`;

  // Reset Email
  const message = `
  <h2>Hello ${name}</h2>
  <p>Thank you for choosing Crib.com</p>  
  <p>Your payment was successful.</p>
  <p>Please continue to your account by clicking on the link below</p>

  <a href=${userProfile} clicktracking=off>${userProfile}</a>

  <p>Regards...</p>
  <p>Crib Team</p>
`;
  const subject = 'Payment Successful';

  const emailTest = 'peter.space.io@gmail.com';
  // const send_to = email;
  const send_to = emailTest;
  const sent_from = process.env.EMAIL_USER;

  console.log({ email: email, name: name });

  await sendEmail(subject, message, send_to, sent_from);
  res
    .status(200)
    .json({ success: true, message: 'your booking was sucessful' });
});

module.exports = {
  createBooking,
  updateOwnerBooking,
  getUserBookings,
  getOneUserBooking,
  getOwnerBookings,
  updateBookingsAutomatically,
  getAllBookings,
  getAllBookingsByOwner,

  //=============================

  getAllCompletedBookings,
  getAllActiveBookings,
  getAllPendingBookings,
  getAllPaidBookings,
  getAllCanceledBookings,
  bookingConfirmation,
  paymentConfirmation,
};
