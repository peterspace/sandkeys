const asyncHandler = require('express-async-handler');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();

const Place = require('../models/PlaceModel');
const User = require('../models/UserModel');
const Room = require('../models/RoomModel');
const Booking = require('../models/BookingModel');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRECT,
});


const getAllPlaces = asyncHandler(async (req, res) => {
 

  const userBookings = await Booking.find().populate('place');

  for (let i = 0; i < userBookings.length; i++) {
    let currentTime = new Date(Date.now());

    // let currentTime = new Date(Date.now()).toString()

    if (
      userBookings[i].checkOut < currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Completed' }
      );
      await Place.findOneAndUpdate(
        { _id: userBookings[i].place },
        { isAvailable: false }
      );
    }

    if (
      userBookings[i].checkOut > currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Active' }
      );
      await Place.findOneAndUpdate(
        { _id: userBookings[i].place },
        { isAvailable: false }
      );
    }
  }

  //returns only "available" properties
  res.json(await Place.find({ isAvailable: true }));
  // res.json(await Place.find({ city: city, type: type}));
});

// get Places By City And Type
const getAllPlacesByCityAndType = asyncHandler(async (req, res) => {
  const { city, type } = req.params;

  const userBookings = await Booking.find().populate('place');

  for (let i = 0; i < userBookings.length; i++) {
    let currentTime = new Date(Date.now());

    // let currentTime = new Date(Date.now()).toString()

    if (
      userBookings[i].checkOut < currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Completed' }
      );
      await Place.findOneAndUpdate(
        { _id: userBookings[i].place },
        { isAvailable: false }
      );
    }

    if (
      userBookings[i].checkOut > currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Active' }
      );
      await Place.findOneAndUpdate(
        { _id: userBookings[i].place },
        { isAvailable: false }
      );
    }
  }

  //returns only "available" properties
  res.json(await Place.find({ city: city, type: type, isAvailable: true }));
  // res.json(await Place.find({ city: city, type: type}));
});

// Create Prouct
const createPlace = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const {
    title,
    city,
    address,
    type,
    addedPhotos,
    description,
    perks,
    paymentOptions,
  } = req.body;

  const placeDoc = await Place.create({
    owner: user._id,
    title,
    city,
    address,
    type,
    photos: addedPhotos,
    description,
    perks,
    paymentOptions,
  });
  res.json(placeDoc);
});


const updatePlaces = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const userId = user._id;
  const {
    id,
    title,
    city,
    address,
    type,
    addedPhotos,
    description,
    perks,
    paymentOptions,
    // rooms,
    rating,
    totalrating,
  } = req.body;

  const placeDoc = await Place.findById(id);
  if (user.role === 'Admin' || userId === placeDoc.owner.toString()) {
    if (placeDoc) {
      placeDoc.title = title || placeDoc.title;
      placeDoc.address = address || placeDoc.address;
      placeDoc.city = city || placeDoc.city;
      placeDoc.type = type || placeDoc.type;
      placeDoc.photos = addedPhotos || placeDoc.photos;
      placeDoc.description = description || placeDoc.description;
      placeDoc.perks = perks || placeDoc.perks;
      placeDoc.paymentOptions = paymentOptions || placeDoc.paymentOptions;
      // placeDoc.rooms = placeDoc.rooms.push(rooms) || placeDoc.rooms; // add rooms
      placeDoc.rating = rating || placeDoc.rating;
      placeDoc.totalrating = totalrating || placeDoc.totalrating;
    }
    await placeDoc.save();
    res.json('ok');
  }
});
// Get all UserPlaces


const getUserPlaces = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(await Place.find({ owner: user._id }));
});

//

// Get single product
const getOnePlace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});




//========{New place}===============================
// Delete Product
const deletePlace = asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  const user = await User.findById(req.user._id);

  const place = await Place.findById(placeId);
  // if place doesnt exist
  if (!place) {
    res.status(404);
    throw new Error('Place not found');
  }
  // Admin and owner can delete or modify a listing
  if (user.role !== 'Admin' || place.owner.toString() !== user._id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  // Match place to its user
  // if (place.owner.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error('User not authorized');
  // }

  await Place.findByIdAndDelete(placeId);
  const message = `Place has been deleted by ${user.name} ${user._id}`;
  const response = {
    message,
  };
  res.status(200).json(response);
  // place.remove();
  // res.status(200).json({ message: 'Place deleted.' });
});

//========={New API calls}========================================

const updatePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (user.role !== 'Admin' || place.owner.toString() !== user._id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedplace = await Place.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  const message = `Updated by ${user.name} ${user._id}`;
  const response = {
    message,
    updatedplace,
  };
  res.status(200).json(response);
});

const countByCity = asyncHandler(async (req, res) => {
  const cities = req.query.cities.split(',');
  const list = await Promise.all(
    cities.map((city) => {
      return Place.countDocuments({ city: city });
    })
  );
  res.status(200).json(list);
});
const countByType = asyncHandler(async (req, res) => {
  const placeCount = await Place.countDocuments({ type: 'hotel' });
  const apartmentCount = await Place.countDocuments({ type: 'apartment' });
  const resortCount = await Place.countDocuments({ type: 'resort' });
  const villaCount = await Place.countDocuments({ type: 'villa' });
  const cabinCount = await Place.countDocuments({ type: 'cabin' });

  res.status(200).json([
    { type: 'place', count: placeCount },
    { type: 'apartments', count: apartmentCount },
    { type: 'resorts', count: resortCount },
    { type: 'villas', count: villaCount },
    { type: 'cabins', count: cabinCount },
  ]);
});




// Get single hotel rooms
const getRoomsInOnePlace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  const rooms = place?.rooms; //  rooms: [{roomId: String,roomNumber: String,},]
  const totalNumofRooms = rooms.length;

  const response = {
    rooms,
    totalNumofRooms,
  };
  res.json(response);
});


const getPlaceRooms = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  const list = await Promise.all(
    place.rooms.map(({roomId}) => {
      return Room.findById(roomId);
    })
  );
  res.status(200).json(list);
});
//================={New Features}============================================

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { roomId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === roomId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: roomId }, // remove
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: roomId }, // add
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, placeId, comment } = req.body;
  try {
    const place = await Place.findById(placeId);
    let alreadyRated = place.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Place.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateplace = await Place.findByIdAndUpdate(
        placeId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Place.findById(placeId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalplace = await Place.findByIdAndUpdate(
      placeId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalplace);
  } catch (error) {
    throw new Error(error);
  }
});

// For search bar filtering, sorting and more
const searchAllPlaces = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Place.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const placeCount = await Place.countDocuments();
      if (skip >= placeCount) throw new Error('This Page does not exists');
    }
    const place = await query;
    res.json(place);
  } catch (error) {
    throw new Error(error);
  }
});

const createRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // if (user.role !== 'Admin') {
  //   res.status(401);
  //   throw new Error('User not authorized');
  // }

  const {
    placeId,
    title,
    city,
    address,
    description,
    extraInfo,
    checkIn,
    checkOut,
    paymentOptions,
    type,
    addedPhotos,
    price,
    perks,
    maxGuests,
    isAvailable,
    // unavailableDates,
    roomNumber,
    roomPerks,
    roomType,
    rating,
  } = req.body;
  const place = await Place.findOne({ owner: user._id, placeId: placeId });
  // console.log({ place: place });

  let availability = true;

  if (isAvailable === 'false') {
    availability = false;
  }

  const roomDoc = await Room.create({
    owner: user._id,
    placeId,
    title,
    city,
    address,
    description,
    extraInfo,
    checkIn,
    checkOut,
    paymentOptions,
    type,
    photos: addedPhotos,
    price,
    perks,
    maxGuests,
    isAvailable: availability,
    // unavailableDates,
    roomNumber,
    roomPerks,
    roomType,
    rating,
  });

  console.log({ roomId: roomDoc?._id });
  console.log({ roomIdFormatted: roomDoc?._id.toString() });
  // const addRooms = user.rooms.push({
  //   roomId: roomDoc?._id,
  // })

  const addRooms = place.rooms.push({
    roomId: roomDoc?._id.toString(),
    roomNumber,
  });

  // const addRooms = place.rooms.push(roomDoc);
  await place.save();
  console.log({ addRooms: addRooms });
  res.json(roomDoc);
});

// Update Product
const updateRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const userId = user._id;
  const {
    roomId,
    placeId,
    title,
    type,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    isAvailable,
    // paymentOptions,
    unavailableDates,
    roomNumber,
    roomPerks,
    roomType,
    rating,
  } = req.body;

  let availability = true;

  if (isAvailable === 'false') {
    availability = false;
  }
  const placeDoc = await Place.findById(placeId);

  const roomDoc = await Room.findByOne({ _id: roomId, placeId: placeId });
  if (user.role === 'Admin' || userId === placeDoc.owner.toString()) {
    roomDoc.set({
      title,
      type,
      photos: addedPhotos,
      description,
      price,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      isAvailable: availability,
      // paymentOptions,
      unavailableDates,
      roomNumber,
      roomPerks,
      roomType,
      rating,
    });
    await roomDoc.save();
    res.json('ok');
  }
});
const updateRoomAvailability = asyncHandler(async (req, res) => {
  await Room.updateOne(
    { 'roomNumbers._id': req.params.id },
    {
      $push: {
        'roomNumbers.$.unavailableDates': req.body.dates,
      },
    }
  );
  res.status(200).json('Room status has been updated.');
});
const deleteRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role !== 'Admin') {
    res.status(401);
    throw new Error('User not authorized');
  }
  const placeId = req.params.placeId;
  await Room.findByIdAndDelete(req.params.id);

  await Place.findByIdAndUpdate(placeId, {
    $pull: { rooms: req.params.id },
  });
  res.status(200).json('Room has been deleted.');
});

// Get single product
const getOneRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json(await Room.findById(id));
});

// const getOneRoom = asyncHandler(async (req, res) => {
//   const room = await Room.findById(req.params.id);
//   res.status(200).json(room);
// });
const getAllRooms = asyncHandler(async (req, res) => {
  // const rooms = await Room.find();
  // res.status(200).json(rooms);
  res.json(await Room.find());


});

const getUserRooms = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(await Room.find({ owner: user._id, placeId: req.params.placeId }));
});

const getAllAvailableRooms = asyncHandler(async (req, res) => {
  const userBookings = await Booking.find().populate('room');

  for (let i = 0; i < userBookings.length; i++) {
    let currentTime = new Date(Date.now());

    // let currentTime = new Date(Date.now()).toString()

    if (
      userBookings[i].checkOut < currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Completed' }
      );
      await Room.findOneAndUpdate(
        { _id: userBookings[i].room },
        { isAvailable: false }
      );
    }

    if (
      userBookings[i].checkOut > currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Active' }
      );
      await Room.findOneAndUpdate(
        { _id: userBookings[i].room },
        { isAvailable: false }
      );
    }
  }

  //returns only "available" properties
  res.json(await Room.find({ isAvailable: true }));
});

const getAllAvailableRoomsByCityAndType = asyncHandler(async (req, res) => {
  const { city, type } = req.params;

  const userBookings = await Booking.find().populate('room');

  for (let i = 0; i < userBookings.length; i++) {
    let currentTime = new Date(Date.now());

    // let currentTime = new Date(Date.now()).toString()

    if (
      userBookings[i].checkOut < currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Completed' }
      );
      await Room.findOneAndUpdate(
        { _id: userBookings[i].room },
        { isAvailable: false }
      );
    }

    if (
      userBookings[i].checkOut > currentTime &&
      userBookings[i].status !== 'Pending' &&
      userBookings[i].status !== 'Cancel'
    ) {
      //   console.log("current time:", currentTime)
      // console.log("checkout time:", userBookings[i].checkOut)

      await Booking.findOneAndUpdate(
        { _id: userBookings[i]._id },
        { status: 'Active' }
      );
      await Room.findOneAndUpdate(
        { _id: userBookings[i].room },
        { isAvailable: false }
      );
    }
  }

  //returns only "available" properties
  res.json(await Room.find({ city: city, type: type, isAvailable: true }));
  // res.json(await Place.find({ city: city, type: type}));
});

module.exports = {
  createPlace,
  getUserPlaces,
  getOnePlace,
  updatePlaces,
  getAllPlaces,
  getAllPlacesByCityAndType,
  //==========={new}=================================
  deletePlace,
  updatePlace,
  getRoomsInOnePlace,
  // getPlaces,
  countByType,
  countByCity,
  getPlaceRooms,
  // updatePlaceAvailability,
  //====={new features}===============================
  addToWishlist,
  rating,

  //====={Rooms}===============================
  createRoom,
  updateRoom,
  updateRoomAvailability,
  deleteRoom,
  getOneRoom,
  getAllRooms,
  getUserRooms,
  getAllAvailableRooms,
  getAllAvailableRoomsByCityAndType,
};
