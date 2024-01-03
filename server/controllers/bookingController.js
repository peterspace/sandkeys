const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;
const User = require('../models/UserModel');

const Booking = require('../models/BookingModel');
const Place = require('../models/PlaceModel');
const Recovery = require('../models/Recovery');
const Room = require('../models/RoomModel');

const sendEmail = require('../utils/sendEmail');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.YOKASSA_SHOPID,
  secretKey: process.env.YOKASSA_SECRET_KEY,
});

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
    status,
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
    status,
    depositStatus: 'Paid', // to be updated
    paymentStatus: 'Unpaid', // to be updated
  });

  const savedBooking = await newBooking.save();

  if (!savedBooking) {
    await statusUpdateOneBooking(savedBooking); // updates booking status
    res.status(400).json({ message: 'booking unsucessful' });
  }
  console.log('booking:', savedBooking);
  const roomDoc = await Room.findById(room);
  if (roomDoc) {
    roomDoc.isAvailable = false;
  }
  const updatedBooking = await roomDoc.save();
  if (updatedBooking) {
    console.log({ updatedBooking: updatedBooking });
  }

  //==={approve booking}=================================
  console.log({ savedBookingResponse: savedBooking });
  res.json(savedBooking);
});

const createBooking1 = asyncHandler(async (req, res) => {
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
    status,
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
    status,
    depositStatus: 'Paid', // to be updated
    paymentStatus: 'Unpaid', // to be updated
  });

  const savedBooking = await newBooking.save();

  if (!savedBooking) {
    await statusUpdateOneBooking(savedBooking); // updates booking status
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

// Get all UserBookings
// const getUserBookings = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   // res.json(await Booking.find({ user: user._id }).populate('room'));
//   res.json(await Booking.find({ user: user._id }).populate('room'));
// });

const getUserBookings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  statusUpdateByUser(user); // update user bookings status
  // res.json(await Booking.find({ user: user._id }).populate('room'));
  res.json(
    await Booking.find({ user: user._id }).populate('room').sort('-createdAt')
  );
});

const getOneUserBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  statusUpdateByUser(user); // update user bookings status

  const { id } = req.params;

  res.json(await Booking.findOne({ user: user._id, _id: id }).populate('room'));
});

const getOneOwnerBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  statusUpdateByUser(user); // update user bookings status

  const { id } = req.params;

  res.json(
    await Booking.findOne({ owner: user._id, _id: id }).populate('room')
  );
});

//==================================={Owner Only}=======================================================

// Get all OwnerBookings
const getOwnerBookings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  statusUpdateByOwner(user); // update user bookings status
  res.json(await Booking.find({ owner: user._id }).populate('room'));
});

const updateOwnerBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // get userId from "protect middleware"
  statusUpdateByOwner(user); // update user bookings status
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
    paymentStatus,
  } = req.body;

  const bookingDoc = await Booking.findById(id);
  if (userId === bookingDoc.owner.toString()) {
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
      paymentStatus,
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

const updateBookingByEmail = asyncHandler(async (req, res) => {
  const { id, userId, newStatus } = req.params;

  const user = await User.findById(userId); // get userId from "protect middleware"
  if (!user) {
    return;
  }

  statusUpdateByOwner(user); // update user bookings status
  // await Booking.findOneAndUpdate({ _id: id }, { paymentStatus: newStatus });

  await Booking.findOneAndUpdate({ _id: id }, { paymentStatus: newStatus });

  const bookingDoc = await Booking.findById(id);
  if (userId === bookingDoc.owner.toString()) {
    bookingDoc.set({
      paymentStatus: newStatus,
    });
    await bookingDoc.save();

    await Booking.findOneAndUpdate({ _id: id }, { paymentStatus: newStatus });
  }

  res.json('ok');
});

// updateBookingByEmailTest()
//======================={Owners actions}==========================================
const updateBookingByEmailApproved = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // const id = '64d69eef7a4cd5502f17a996';
  const booking = await Booking.findById(id);
  if (booking) {
    booking.paymentStatus = 'Unpaid';
    booking.approval = 'Yes';
  }
  const updatedBooking = await booking.save();
  if (updatedBooking) {
    console.log({ updatedBooking: updatedBooking });
    res.json(updatedBooking);
  }
});

// updateBookingByEmailApproved()

const updateBookingByEmailRejected = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // const id = '64d69eef7a4cd5502f17a996';

  const booking = await Booking.findById(id);

  if (booking) {
    console.log({ booking1: booking });
    booking.paymentStatus = 'Pending';
    booking.approval = 'No';
  }
  const updatedBooking = await booking.save();
  if (updatedBooking) {
    console.log({ updatedBooking: updatedBooking });
    res.json(updatedBooking);
  }
});

// updateBookingByEmailRejected()

//======================={users actions}==========================================
//if payment sucessfull
const updateBookingByEmailPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // const id = '64d69eef7a4cd5502f17a996';

  const newStatus = 'Paid';
  const booking = await Booking.findById(id);

  if (booking) {
    booking.paymentStatus = newStatus || booking.paymentStatus;
  }

  const updatedBooking = await booking.save();
  if (updatedBooking) {
    console.log({ updatedBooking: updatedBooking });
    res.json(updatedBooking);
  }
});

// updateBookingByEmailPaid()

async function statusUpdateOneBooking(booking) {
  let checkIn = new Date(booking?.checkIn).getTime();
  let checkOut = new Date(booking?.checkOut).getTime();
  let currentTime = new Date(Date.now()).getTime();

  console.log({
    checkIn: checkIn,
    checkOut: checkOut,
    currentTime: currentTime,
  });

  let newStatusx;

  if (
    checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
    checkOut >= currentTime
  ) {
    newStatusx = 'Active';
  }

  if (
    checkIn > currentTime && // checkIn date is ahead of now
    checkOut > currentTime
  ) {
    newStatusx = 'Inactive';
  }

  //==={Is Completed}==================

  if (checkOut < currentTime) {
    newStatusx = 'Completed';
  }

  const userData = {
    id: booking._id, // new
    place: booking?.room?.placeId,
    room: booking?.room?._id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    numberOfGuests: booking.numberOfGuests,
    name: booking.name,
    phone: booking.phone,
    price: booking.price,
    paymentMethod: booking.paymentMethod,
    owner: booking.owner,
    status: newStatusx, // new update
  };
  console.log('userData:', userData);
  updateBookingsAutomaticallyInternal(userData);
}

// Pool data at intervals of 30 mins
async function statusUpdate() {
  const bookings = await Booking.find().populate('room');
  bookings?.map(async (booking) => {
    let checkIn = new Date(booking?.checkIn).getTime();
    let checkOut = new Date(booking?.checkOut).getTime();
    let currentTime = new Date(Date.now()).getTime();

    console.log({
      checkIn: checkIn,
      checkOut: checkOut,
      currentTime: currentTime,
    });

    let newStatusx;

    if (
      checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
      checkOut >= currentTime
    ) {
      newStatusx = 'Active';
    }

    if (
      checkIn > currentTime && // checkIn date is ahead of now
      checkOut > currentTime
    ) {
      newStatusx = 'Inactive';
    }

    //==={Is Completed}==================

    if (checkOut < currentTime) {
      newStatusx = 'Completed';
    }

    const userData = {
      id: booking._id, // new
      place: booking?.room?.placeId,
      room: booking?.room?._id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      numberOfGuests: booking.numberOfGuests,
      name: booking.name,
      phone: booking.phone,
      price: booking.price,
      paymentMethod: booking.paymentMethod,
      owner: booking.owner,
      status: newStatusx, // new update
    };
    console.log('userData:', userData);
    updateBookingsAutomaticallyInternal(userData);
  });
}

// statusUpdate()
//================{update booking status when user fetches bookings}===================
async function statusUpdateByUser(user) {
  const bookings = await Booking.find({ user: user._id }).populate('room');
  bookings?.map(async (booking) => {
    let checkIn = new Date(booking?.checkIn).getTime();
    let checkOut = new Date(booking?.checkOut).getTime();
    let currentTime = new Date(Date.now()).getTime();

    console.log({
      checkIn: checkIn,
      checkOut: checkOut,
      currentTime: currentTime,
    });

    let newStatusx;

    if (
      checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
      checkOut >= currentTime
    ) {
      newStatusx = 'Active';
    }

    if (
      checkIn > currentTime && // checkIn date is ahead of now
      checkOut > currentTime
    ) {
      newStatusx = 'Inactive';
    }

    //==={Is Completed}==================

    if (checkOut < currentTime) {
      newStatusx = 'Completed';
    }

    const userData = {
      id: booking._id, // new
      place: booking?.room?.placeId,
      room: booking?.room?._id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      numberOfGuests: booking.numberOfGuests,
      name: booking.name,
      phone: booking.phone,
      price: booking.price,
      paymentMethod: booking.paymentMethod,
      owner: booking.owner,
      status: newStatusx, // new update
    };
    console.log('userData:', userData);
    updateBookingsAutomaticallyInternal(userData);
  });
}
//================{update booking status when owner fetches bookings}===================

async function statusUpdateByOwner(user) {
  const bookings = await Booking.find({ owner: user._id }).populate('room');
  bookings?.map(async (booking) => {
    let checkIn = new Date(booking?.checkIn).getTime();
    let checkOut = new Date(booking?.checkOut).getTime();
    let currentTime = new Date(Date.now()).getTime();

    console.log({
      checkIn: checkIn,
      checkOut: checkOut,
      currentTime: currentTime,
    });

    let newStatusx;

    if (
      checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
      checkOut >= currentTime
    ) {
      newStatusx = 'Active';
    }

    if (
      checkIn > currentTime && // checkIn date is ahead of now
      checkOut > currentTime
    ) {
      newStatusx = 'Inactive';
    }

    //==={Is Completed}==================

    if (checkOut < currentTime) {
      newStatusx = 'Completed';
    }

    const userData = {
      id: booking._id, // new
      place: booking?.room?.placeId,
      room: booking?.room?._id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      numberOfGuests: booking.numberOfGuests,
      name: booking.name,
      phone: booking.phone,
      price: booking.price,
      paymentMethod: booking.paymentMethod,
      owner: booking.owner,
      status: newStatusx, // new update
    };
    console.log('userData:', userData);
    updateBookingsAutomaticallyInternal(userData);
  });
}

//====={Montor all Bookings transactions at intervals : default here is every 30 minute}========================
//======{Pooling works and should be used for fetching and updating all current market data per set intervals}=================
const poolRequestForAllBookings = async () => {
  const intervalId = setInterval(() => {
    statusUpdate();
  }, 180000); // check after every 30 minute
  // }, 30 * 60 * 60 * 1000); // check after every 30 minute

  return () => {
    clearInterval(intervalId);
  };
};

poolRequestForAllBookings();

const updateBookingsAutomaticallyInternal = asyncHandler(async (userData) => {
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
  } = userData;

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

  console.log('ok');
  // res.json('ok');
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
  res.json(await Booking.find({ owner: user._id }).populate('room'));
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

//==================================={Paid Bookings}=======================================================
const getAllInactiveBookings = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;

  const userBookings = await Booking.find({ owner: ownerId }).populate('room');
  let userBooks = [];

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    let status = booking.status;
    // let status = userBookings[i].status
    if (status === 'Inactive') {
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

// new Date(m?.createdAt).toLocaleTimeString()
const bookingConfirmation = asyncHandler(async (req, res) => {
  const { email, name, booking } = req.body;
  const user = await User.findOne({ email });

  console.log({ newBooking: booking });

  if (!booking) {
    throw new Error('Booking not found');
  }

  console.log({
    email: email,
    name: name,
    booking: booking,
  });

  if (!user) {
    res.status(404);
    throw new Error('User does not exist');
  }

  // ${new Date(booking?.checkOut).toLocaleTimeString()}
  const checkInRaw = new Date(booking?.checkIn);
  const checkOutRaw = new Date(booking?.checkOut);

  //===full ==> Monday, September 11, 2023
  const formatDate = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'full',
  });

  //===long ==> September 11, 2023
  const formatDateMedium = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'long',
  });

  //===medium ==> Sep 10, 2023
  // const formatDateMedium = new Intl.DateTimeFormat('en-us', {
  //   dateStyle: 'medium',
  // });

  const checkIn = formatDate.format(checkInRaw);
  const checkOut = formatDate.format(checkOutRaw);
  const checkInMedium = formatDateMedium.format(checkInRaw);
  const subject = 'Booking Confirmation';

  // Delete token if it exists in DB
  const message = `<!DOCTYPE html>

  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
  
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
  
      p {
        line-height: inherit
      }
  
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }
  
      .image_block img+div {
        display: none;
      }
  
      @media (max-width:620px) {
        .desktop_hide table.icons-inner {
          display: inline-block !important;
        }
  
        .icons-inner {
          text-align: center;
        }
  
        .icons-inner td {
          margin: 0 auto;
        }
  
        .mobile_hide {
          display: none;
        }
  
        .row-content {
          width: 100% !important;
        }
  
        .stack .column {
          width: 100%;
          display: block;
        }
  
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dc2626; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">Confirmation number: ${booking?._id} </p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;text-align:center;width:100%;">
  <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Crib</span></h1>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:30px;text-align:center;width:100%;">
  <h3 style="margin: 0; color: #000000; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Thanks ${name}!</span></h3>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">Your booking in ${booking?.room?.city} is confirmed</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:20px;padding-right:20px;width:100%;">
  <div align="center" class="alignment" style="line-height:10px"><img src=${
    booking?.room?.photos[0]
  } style="display: block; height: auto; border: 0; max-width: 580px; width: 100%;" width="580"/></div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <h3 style="margin: 0; color: #dc2626; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">${
    booking?.room?.title
  }</span></h3>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${booking?.room?.address}, ${booking?.room?.city}</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;"><em>⇒ ${
    booking?.room?.title
  } will be expecting you on ${checkInMedium}</em></p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">⇒ The booking balance of ${
    0.75 * booking?.totalPrice
  } RUB will be handled by ${booking?.room?.title}</p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">⇒ More details are available at the “<strong>Payment</strong>” section below</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Reservation</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${booking?.numberOfNights} night, ${
    booking?.room?.roomType
  } room</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Check-in</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${checkIn} (from ${booking?.room?.checkIn}:00)</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Check-out</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${checkOut} (until ${booking?.room?.checkOut}:00)</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Deposit</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${0.25 * booking?.totalPrice} RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-17" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Balance</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${0.75 * booking?.totalPrice} RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-18" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-19" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Total</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${booking?.totalPrice} RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-20" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-21" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; background-color: #dc2626; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:86px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#dc2626; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
  <div style="text-decoration:none;display:inline-block;color:#dc2626;background-color:#ffffff;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Print</span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-22" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
  <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
  <!--[if !vml]><!-->
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table><!-- End -->
  </body>
  </html>`;

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

//update to booking id only and find booking by id
const bookingNotificationOwner = asyncHandler(async (req, res) => {
  // const { email, name, booking } = req.body;

  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate('owner');

  if (!booking) {
    throw new Error('Booking not found');
  }

  console.log({ booking: booking });
  //===={find user and create expiring token}=============================
  const user = await User.findOne({ email: booking?.owner?.email });
  // console.log({user: user})
  if (!user) {
    res.status(400);
    throw new Error('User does not exist');
  }

  // Delete token if it exists in DB
  let token = await Recovery.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create otp Token and hash with bcrypt
  const otp = Math.floor(1000 + Math.random() * 9000);

  const salt = await bcrypt.genSalt(10);
  const hashedOtP = await bcrypt.hash(otp.toString(), salt);
  const authId = uuidv4(); // new unique identifier

  // Save Token to DB
  await new Recovery({
    userId: user._id,
    token: hashedOtP,
    authId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * (60 * 1000), // 5 minutes
  }).save();

  // ${new Date(booking?.checkOut).toLocaleTimeString()}
  const checkInRaw = new Date(booking?.checkIn);
  const checkOutRaw = new Date(booking?.checkOut);

  //===full ==> Monday, September 11, 2023
  const formatDate = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'full',
  });

  //===long ==> September 11, 2023
  const formatDateMedium = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'long',
  });

  //===medium ==> Sep 10, 2023
  // const formatDateMedium = new Intl.DateTimeFormat('en-us', {
  //   dateStyle: 'medium',
  // });

  const checkIn = formatDate.format(checkInRaw);
  const checkOut = formatDate.format(checkOutRaw);
  const checkInMedium = formatDateMedium.format(checkInRaw);
  const subject = 'Booking Notification';

  // const id = booking?_id.toString()

  const yesUrl = `${process.env.FRONTEND_URL}/approval/${authId}/yes`;
  const noUrl = `${process.env.FRONTEND_URL}/approval/${authId}/no`;

  // Delete token if it exists in DB
  const message = `<!DOCTYPE html>

  <html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
  >
    <head>
      <title></title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <style>
        * {
          box-sizing: border-box;
        }
  
        body {
          margin: 0;
          padding: 0;
        }
  
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
  
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
  
        p {
          line-height: inherit;
        }
  
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
  
        .image_block img + div {
          display: none;
        }
  
        @media (max-width: 620px) {
          .desktop_hide table.icons-inner {
            display: inline-block !important;
          }
  
          .icons-inner {
            text-align: center;
          }
  
          .icons-inner td {
            margin: 0 auto;
          }
  
          .mobile_hide {
            display: none;
          }
  
          .row-content {
            width: 100% !important;
          }
  
          .stack .column {
            width: 100%;
            display: block;
          }
  
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }
  
          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
      </style>
    </head>
    <body
      style="
        background-color: #fff;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="nl-container"
        role="presentation"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          background-color: #fff;
        "
        width="100%"
      >
        <tbody>
          <tr>
            <td>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-1"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #dc2626;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div
                                      style="
                                        color: #ffffff;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        Confirmation number: ${booking?._id} 
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="heading_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      text-align: center;
                                      width: 100%;
                                    "
                                  >
                                    <h1
                                      style="
                                        margin: 0;
                                        color: #ffffff;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 38px;
                                        font-weight: 700;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                      "
                                    >
                                      <span class="tinyMce-placeholder"
                                        >Crib</span
                                      >
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-2"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #e4e4e7;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="heading_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      padding-top: 30px;
                                      text-align: center;
                                      width: 100%;
                                    "
                                  >
                                    <h3
                                      style="
                                        margin: 0;
                                        color: #000000;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 24px;
                                        font-weight: 700;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                      "
                                    >
                                      <span class="tinyMce-placeholder"
                                        >Hi ${booking?.room?.title}!</span
                                      >
                                    </h3>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        A client in ${booking?.room?.city} wants
                                        to book a ${booking?.room?.roomType} in
                                        your ${booking?.room?.type}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-3"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #e4e4e7;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 20px;
                                      padding-right: 20px;
                                      width: 100%;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        src="${booking?.room?.photos[0]}
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          max-width: 580px;
                                          width: 100%;
                                        "
                                        width="580"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-4"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #e4e4e7;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="heading_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <h3
                                      style="
                                        margin: 0;
                                        color: #dc2626;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 24px;
                                        font-weight: 400;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                      "
                                    >
                                      <span class="tinyMce-placeholder"
                                        >${booking?.room?.title}</span
                                      >
                                    </h3>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-5"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #e4e4e7;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${booking?.room?.address},
                                        ${booking?.room?.city}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-6"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-7"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #dc2626;
                                        direction: ltr;
                                        font-family: Georgia, Times,
                                          'Times New Roman', serif;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <em
                                          >⇒ The client will arrive on
                                          ${checkInMedium}</em
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #dc2626;
                                        direction: ltr;
                                        font-family: Georgia, Times,
                                          'Times New Roman', serif;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ⇒ The booking balance of ${
                                          0.75 * booking?.totalPrice
                                        } RUB will be handled
                                        by ${booking?.room?.title}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-3"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #dc2626;
                                        direction: ltr;
                                        font-family: Georgia, Times,
                                          'Times New Roman', serif;
                                        font-size: 14px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 16.8px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ⇒ Please confirm by clicking the
                                        “<strong>Yes</strong>” button below
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-8"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-9"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="33.333333333333336%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <strong>Reservation</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="66.66666666666667%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #6b7280;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${booking?.numberOfNights} night, ${
    booking?.room?.roomType
  } room
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-10"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-11"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="33.333333333333336%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <strong>Check-in</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="66.66666666666667%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #6b7280;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${checkIn} (from
                                        ${booking?.room?.checkIn}:00)
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-12"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-13"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="33.333333333333336%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <strong>Check-out</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="66.66666666666667%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #6b7280;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${checkOut} (until
                                        ${booking?.room?.checkOut}:00)
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-14"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-15"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="33.333333333333336%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <strong>Deposit</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="66.66666666666667%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #6b7280;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${0.25 * booking?.totalPrice} RUB
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-16"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-17"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="33.333333333333336%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <strong>Balance</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="66.66666666666667%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #6b7280;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${0.75 * booking?.totalPrice} RUB
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-18"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-19"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="33.333333333333336%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #101112;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        <strong>Total</strong>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="66.66666666666667%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="paragraph_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div
                                      style="
                                        color: #6b7280;
                                        direction: ltr;
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: right;
                                        mso-line-height-alt: 19.2px;
                                      "
                                    >
                                      <p style="margin: 0">
                                        ${booking?.totalPrice} RUB
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-20"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span> </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-21"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          background-color: #dc2626;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="button_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div align="center" class="alignment">
                                      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:86px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#dc2626; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                                      <div
                                        style="
                                          text-decoration: none;
                                          display: inline-block;
                                          color: #dc2626;
                                          background-color: #ffffff;
                                          border-radius: 4px;
                                          width: auto;
                                          border-top: 0px solid transparent;
                                          font-weight: 400;
                                          border-right: 0px solid transparent;
                                          border-bottom: 0px solid transparent;
                                          border-left: 0px solid transparent;
                                          padding-top: 5px;
                                          padding-bottom: 5px;
                                          font-family: Arial, Helvetica,
                                            sans-serif;
                                          font-size: 16px;
                                          text-align: center;
                                          mso-border-alt: none;
                                          word-break: keep-all;
                                        "
                                      >
                                      <a href="${yesUrl}" clicktracking="off"
                                      ><span
                                        style="
                                          padding-left: 20px;
                                          padding-right: 20px;
                                          font-size: 16px;
                                          display: inline-block;
                                          letter-spacing: normal;
                                        "
                                        ><span
                                          style="
                                            word-break: break-word;
                                            line-height: 32px;
                                          "
                                          >Yes</span
                                        ></span
                                      ></a
                                    >
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-21"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-radius: 0;
                          color: #000;
                          background-color: #dc2626;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                class="button_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div align="center" class="alignment">
                                      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:86px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#dc2626; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                                      <div
                                        style="
                                          text-decoration: none;
                                          display: inline-block;
                                          color: #dc2626;
                                          background-color: #ffffff;
                                          border-radius: 4px;
                                          width: auto;
                                          border-top: 0px solid transparent;
                                          font-weight: 400;
                                          border-right: 0px solid transparent;
                                          border-bottom: 0px solid transparent;
                                          border-left: 0px solid transparent;
                                          padding-top: 5px;
                                          padding-bottom: 5px;
                                          font-family: Arial, Helvetica,
                                            sans-serif;
                                          font-size: 16px;
                                          text-align: center;
                                          mso-border-alt: none;
                                          word-break: keep-all;
                                        "
                                      >
                                        <a href="${noUrl}" clicktracking="off"
                                          ><span
                                            style="
                                              padding-left: 20px;
                                              padding-right: 20px;
                                              font-size: 16px;
                                              display: inline-block;
                                              letter-spacing: normal;
                                            "
                                            ><span
                                              style="
                                                word-break: break-word;
                                                line-height: 32px;
                                              "
                                              >No</span
                                            ></span
                                          ></a
                                        >
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-22"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #ffffff;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          color: #000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="icons_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      vertical-align: middle;
                                      color: #1e0e4b;
                                      font-family: 'Inter', sans-serif;
                                      font-size: 15px;
                                      padding-bottom: 5px;
                                      padding-top: 5px;
                                      text-align: center;
                                    "
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                      "
                                      width="100%"
                                    >
                                      <tr>
                                        <td
                                          class="alignment"
                                          style="
                                            vertical-align: middle;
                                            text-align: center;
                                          "
                                        >
                                          <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                          <!--[if !vml]><!-->
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- End -->
    </body>
  </html>
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

const bookingNotificationUser = asyncHandler(async (req, res) => {
  const { email, name, booking } = req.body;
  const user = await User.findOne({ email });

  console.log({ newBooking: booking });

  if (!booking) {
    throw new Error('Booking not found');
  }

  console.log({
    email: email,
    name: name,
    booking: booking,
  });

  if (!user) {
    res.status(404);
    throw new Error('User does not exist');
  }

  // ${new Date(booking?.checkOut).toLocaleTimeString()}
  const checkInRaw = new Date(booking?.checkIn);
  const checkOutRaw = new Date(booking?.checkOut);

  //===full ==> Monday, September 11, 2023
  const formatDate = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'full',
  });

  //===long ==> September 11, 2023
  const formatDateMedium = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'long',
  });

  //===medium ==> Sep 10, 2023
  // const formatDateMedium = new Intl.DateTimeFormat('en-us', {
  //   dateStyle: 'medium',
  // });

  const checkIn = formatDate.format(checkInRaw);
  const checkOut = formatDate.format(checkOutRaw);
  const checkInMedium = formatDateMedium.format(checkInRaw);
  const subject = 'Booking Confirmation';

  // Delete token if it exists in DB
  const message = `<!DOCTYPE html>

  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
  
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
  
      p {
        line-height: inherit
      }
  
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }
  
      .image_block img+div {
        display: none;
      }
  
      @media (max-width:620px) {
        .desktop_hide table.icons-inner {
          display: inline-block !important;
        }
  
        .icons-inner {
          text-align: center;
        }
  
        .icons-inner td {
          margin: 0 auto;
        }
  
        .mobile_hide {
          display: none;
        }
  
        .row-content {
          width: 100% !important;
        }
  
        .stack .column {
          width: 100%;
          display: block;
        }
  
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dc2626; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">Confirmation number: ${booking?._id} </p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;text-align:center;width:100%;">
  <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Crib</span></h1>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:30px;text-align:center;width:100%;">
  <h3 style="margin: 0; color: #000000; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Thanks ${name}!</span></h3>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">Your booking in ${booking?.room?.city} is confirmed</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:20px;padding-right:20px;width:100%;">
  <div align="center" class="alignment" style="line-height:10px"><img src=${
    booking?.room?.photos[0]
  } style="display: block; height: auto; border: 0; max-width: 580px; width: 100%;" width="580"/></div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <h3 style="margin: 0; color: #dc2626; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">${
    booking?.room?.title
  }</span></h3>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${booking?.room?.address}, ${booking?.room?.city}</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;"><em>⇒ ${
    booking?.room?.title
  } will be expecting you on ${checkInMedium}</em></p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">⇒ The booking balance of ${
    0.75 * booking?.totalPrice
  } RUB will be handled by ${booking?.room?.title}</p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">⇒ More details are available at the “<strong>Payment</strong>” section below</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Reservation</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${booking?.numberOfNights} night, ${
    booking?.room?.roomType
  } room</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Check-in</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${checkIn} (from ${booking?.room?.checkIn}:00)</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Check-out</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${checkOut} (until ${booking?.room?.checkOut}:00)</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Deposit</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${0.25 * booking?.totalPrice} RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-17" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Balance</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${0.75 * booking?.totalPrice} RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-18" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-19" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Total</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">${booking?.totalPrice} RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-20" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-21" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; background-color: #dc2626; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:86px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#dc2626; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
  <div style="text-decoration:none;display:inline-block;color:#dc2626;background-color:#ffffff;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Print</span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-22" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
  <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
  <!--[if !vml]><!-->
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table><!-- End -->
  </body>
  </html>`;

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
  const message = `<!DOCTYPE html>

  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
  
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
  
      p {
        line-height: inherit
      }
  
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }
  
      .image_block img+div {
        display: none;
      }
  
      @media (max-width:620px) {
        .desktop_hide table.icons-inner {
          display: inline-block !important;
        }
  
        .icons-inner {
          text-align: center;
        }
  
        .icons-inner td {
          margin: 0 auto;
        }
  
        .mobile_hide {
          display: none;
        }
  
        .row-content {
          width: 100% !important;
        }
  
        .stack .column {
          width: 100%;
          display: block;
        }
  
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dc2626; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">Confirmation number: 302899857 </p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;text-align:center;width:100%;">
  <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Crib</span></h1>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:30px;text-align:center;width:100%;">
  <h3 style="margin: 0; color: #000000; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Thanks ${name}!</span></h3>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">Your booking in Saint Petersburg is confirmed</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:20px;padding-right:20px;width:100%;">
  <div align="center" class="alignment" style="line-height:10px"><img src="https://res.cloudinary.com/datkh2oxv/image/upload/v1685187200/authenticateRedux/xl4fiirwujuw70u2sljv.jpg" style="display: block; height: auto; border: 0; max-width: 580px; width: 100%;" width="580"/></div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <h3 style="margin: 0; color: #dc2626; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Corinth Hotels</span></h3>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e4e7; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">25, Marata st, Saint petersburg</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;"><em>⇒ Corinth Hotel will be expecting you on 10 September</em></p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">⇒ The booking balance of 7,500 RUB will be handled by Corinth Hotel</p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#dc2626;direction:ltr;font-family:Georgia, Times, 'Times New Roman', serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
  <p style="margin: 0;">⇒ More details are available at the “<strong>Payment</strong>” section below</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Reservation</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">1 night, Standard room</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Check-in</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">Friday 10 September 2023 (from 14:00)</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Check-out</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">Saturday 11 September 2023 (until 12:00)</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Deposit</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">2,500 RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-17" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Balance</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">7,500 RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-18" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-19" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
  <p style="margin: 0;"><strong>Total</strong></p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
  <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#6b7280;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
  <p style="margin: 0;">10,000 RUB</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-20" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-21" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000; background-color: #dc2626; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:86px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#dc2626; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
  <div style="text-decoration:none;display:inline-block;color:#dc2626;background-color:#ffffff;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Print</span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-22" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
  <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
  <!--[if !vml]><!-->
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table><!-- End -->
  </body>
  </html>`;

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

const createYandexPay = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { amount, currency, paymentMethod, description, reservationId } =
    req.body;
  const successId = '1'; // new Idea
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
      // return_url: 'http://localhost:5173/paySuccess',
      // return_url: 'http://localhost:5173/placePage',
      // return_url: `${process.env.FRONTEND_URL}/placePage/${successId}`,
      // return_url: `${process.env.BACKEND_URL}/bookings/authSucessYandex`,
      // return_url: `${process.env.BACKEND_URL}/authSucessYandex`,
      // return_url: "https://www.merchant-website.com/return_url"
      return_url: `${process.env.FRONTEND_URL}/booking/${reservationId}/${successId}`,
    },
    description,
  });

  if (payment) {
    res.json(payment);
  }
});
//https://yoomoney.ru/checkout/payments/v2/success?orderId=2cc58cb2-000f-5000-9000-1de250970519
//Payment code : 2cc58cb2-000f-5000-9000-1de250970519

//https://yoomoney.ru/checkout/payments/v2/success?orderId=2cc58f54-000f-5000-9000-15f8a969ee2b
//Payment code : 2cc58f54-000f-5000-9000-15f8a969ee2b

const authSucessYandex = asyncHandler(async (req, res) => {
  // const { email, password } = req.body;
  let data = req.body;
  console.log({ data: data });

  console.log({ fullRequest: req });

  // if (req.user) {
  //   const accountId = req.user.id;
  //   const email = req.user.emails[0].value;
  //   const name = req.user.displayName;
  //   const provider = req.user.provider;

  //   const otp = Math.floor(1000 + Math.random() * 9000);
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedOtP = await bcrypt.hash(otp.toString(), salt);
  //   const authId = uuidv4(); // new unique identifier

  //   // Delete token if it exists in DB
  //   let token = await Recovery.findOne({ accountId: accountId });
  //   if (token) {
  //     await token.deleteOne();
  //   }

  //   await new Recovery({
  //     accountId,
  //     email,
  //     name,
  //     provider,
  //     token: hashedOtP,
  //     authId,
  //     // token: otp.toString(),
  //     createdAt: Date.now(),
  //     expiresAt: Date.now() + 5 * (60 * 1000), // 5 minutes
  //   }).save();

  //   const url = `${process.env.FRONTEND_URL}/auth/success/${authId}`;
  //   res.redirect(url);
  // }
});

const getYandexPayment = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id); // get userId from "protect middleware"
  const { paymentId } = req.params;

  const payment = await yooKassa.getPayment({
    payment_id: paymentId,
  });

  if (payment) {
    console.log({ payment: payment });
    res.json(payment);
  }
});

// after email response
const getBookingApproval = asyncHandler(async (req, res) => {
  const { authId, id } = req.body;

  const tokenExists = await Recovery.findOne({ authId });
  if (!tokenExists) {
    res.status(400);
    throw new Error('Invalid otp');
  }
  //========={Check if the hashed OTP has not expired}============
  const userToken = await Recovery.findOne({
    token: tokenExists?.token,
    authId: authId,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error('Token has expired');
  }

  //update transaction
  // Find user
  if (id === 'yes') {
    //==={approve booking}=================================
    const booking = await Booking.findById(id);
    if (booking) {
      booking.paymentStatus = 'Unpaid';
      booking.approval = 'Yes';
    }
    const updatedBooking = await booking.save();
    if (updatedBooking) {
      console.log({ updatedBooking: updatedBooking });
    }

    const user = await User.findOne({ _id: userToken.userId });

    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (user) {
      const { _id, name, email, photo, role } = user;
      let response = {
        userId: _id,
        name,
        email,
        photo,
        role,
        token,
        authId,
      };
      res.status(200).json(response);
    } else {
      res.status(400);
      throw new Error('Invalid OTP');
    }
  }

  if (id === 'no') {
    //==={approve booking}=================================
    const booking = await Booking.findById(id);
    if (booking) {
      booking.paymentStatus = 'Pending';
      booking.approval = 'No';
    }
    const updatedBooking = await booking.save();
    if (updatedBooking) {
      console.log({ updatedBooking: updatedBooking });
    }

    const user = await User.findOne({ _id: userToken.userId });

    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (user) {
      const { _id, name, email, photo, role } = user;
      let response = {
        userId: _id,
        name,
        email,
        photo,
        role,
        token,
        authId,
      };
      res.status(200).json(response);
    } else {
      res.status(400);
      throw new Error('Invalid OTP');
    }
  }
});

const getReservations = asyncHandler(async (req, res) => {
  const { authId, id } = req.body;

  const tokenExists = await Recovery.findOne({ authId });
  if (!tokenExists) {
    res.status(400);
    throw new Error('Invalid otp');
  }
  //========={Check if the hashed OTP has not expired}============
  const userToken = await Recovery.findOne({
    token: tokenExists?.token,
    authId: authId,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error('Token has expired');
  }

  //update transaction
  // Find user
  if (id === 'yes') {
    //==={approve booking}=================================
    const booking = await Booking.findById(id);
    if (booking) {
      booking.paymentStatus = 'Unpaid';
      booking.approval = 'Yes';
    }
    const updatedBooking = await booking.save();
    if (updatedBooking) {
      console.log({ updatedBooking: updatedBooking });
    }

    const user = await User.findOne({ _id: userToken.userId });

    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (user) {
      const { _id, name, email, photo, role } = user;
      let response = {
        userId: _id,
        name,
        email,
        photo,
        role,
        token,
        authId,
      };
      res.status(200).json(response);
    } else {
      res.status(400);
      throw new Error('Invalid OTP');
    }
  }

  if (id === 'no') {
    //==={approve booking}=================================
    const booking = await Booking.findById(id);
    if (booking) {
      booking.paymentStatus = 'Pending';
      booking.approval = 'No';
    }
    const updatedBooking = await booking.save();
    if (updatedBooking) {
      console.log({ updatedBooking: updatedBooking });
    }

    const user = await User.findOne({ _id: userToken.userId });

    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: 'none',
      secure: true,
    });

    if (user) {
      const { _id, name, email, photo, role } = user;
      let response = {
        userId: _id,
        name,
        email,
        photo,
        role,
        token,
        authId,
      };
      res.status(200).json(response);
    } else {
      res.status(400);
      throw new Error('Invalid OTP');
    }
  }
});

// export default async function getReservations1(
// ) {
//   try {
//     // const { listingId, userId, authorId } = params;
//     const { listingId, userId, authorId } = req.body;

//     const query= {};

//     if (listingId) {
//       query.listingId = listingId;
//     };

//     if (userId) {
//       query.userId = userId;
//     }

//     if (authorId) {
//       query.listing = { userId: authorId };
//     }

//     const reservations = await Booking.findMany({
//       where: query,
//       include: {
//         listing: true
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     const safeReservations = reservations.map(
//       (reservation) => ({
//       ...reservation,
//       createdAt: reservation.createdAt.toISOString(),
//       startDate: reservation.checkIn.toISOString(),
//       endDate: reservation.checkOut.toISOString(),
//       listing: {
//         ...reservation.listing,
//         createdAt: reservation.listing.createdAt.toISOString(),
//       },
//     }));

//     return safeReservations;
//   } catch (error) {
//     throw new Error(error);
//   }
// }

const getRoomsByBookingDate = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const allRoomBookings = [];

  const roomDates = await Booking.find({ room: roomId })
    .populate('room')
    .sort('-createdAt');

  if (roomDates) {
    const result = roomDates?.map((booking) => {
      const checkIn = booking?.checkIn;
      const checkOut = booking?.checkOut;
      allRoomBookings.push({
        checkIn,
        checkOut,
      });
    });
    console.log({ allRoomBookings: allRoomBookings });
    // return allRoomBookings;
    res.status(200).json(allRoomBookings);
  }
});

const getRoomsByBookingDateInternal = asyncHandler(async (roomId) => {
  const allRoomBookings = [];

  const roomDates = await Booking.find({ room: roomId })
    .populate('room')
    .sort('-createdAt');

  if (roomDates) {
    const result = roomDates?.map((booking) => {
      const checkIn = booking?.checkIn;
      const checkOut = booking?.checkOut;
      allRoomBookings.push({
        checkIn,
        checkOut,
      });
    });
    console.log({ allRoomBookings: allRoomBookings });
    // return allRoomBookings;
    // res.status(200).json(allRoomBookings);
  }
});

// getRoomsByBookingDateInternal('6471eaa7929b0e91a5c9780e')

// {
//   allRoomBookings: [
//     {
//       checkIn: 2023-08-13T00:00:00.000Z,
//       checkOut: 2023-08-14T00:00:00.000Z
//     },
//     {
//       checkIn: 2023-08-15T00:00:00.000Z,
//       checkOut: 2023-08-16T00:00:00.000Z
//     },
//     {
//       checkIn: 2023-08-14T00:00:00.000Z,
//       checkOut: 2023-08-16T00:00:00.000Z
//     },
//     {
//       checkIn: 2023-08-14T00:00:00.000Z,
//       checkOut: 2023-08-15T00:00:00.000Z
//     },
//     {
//       checkIn: 2023-08-15T00:00:00.000Z,
//       checkOut: 2023-08-16T00:00:00.000Z
//     },
//     {
//       checkIn: 2023-08-15T00:00:00.000Z,
//       checkOut: 2023-08-16T00:00:00.000Z
//     }
//   ]
// }

module.exports = {
  createBooking,
  updateOwnerBooking,
  getUserBookings,
  getOneUserBooking,
  getOneOwnerBooking,
  getOwnerBookings,
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
};

// const yesUrl = `${process.env.FRONTEND_URL}/otp/${authId}/yes`;
// const noUrl = `${process.env.FRONTEND_URL}/otp/${authId}/no`;
//6471ec9fd0eddc8278dd0602//2-6 december