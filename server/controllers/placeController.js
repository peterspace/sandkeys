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

//check
//db.bios.find( { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } } )

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
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    isAvailable,
    paymentOptions,
    rooms,
    roomDesc,
    roomNumbers,
    roomMaxPeople,
  } = req.body;

  let availability = true;

  if (isAvailable === 'false') {
    availability = false;
  }

  const placeDoc = await Place.create({
    owner: user._id,
    price,
    title,
    city,
    address,
    type,
    photos: addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    isAvailable: availability,
    paymentOptions,
  });
  res.json(placeDoc);
});

// Get all UserPlaces

const getUserPlaces = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  console.log({ userId: user._id });
  res.json(await Place.find({ owner: user._id }));
});

//

// Get single product
const getOnePlace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Update Product

const updateRoomData = async (place) => {
  // console.log({
  //   placeId1: place?._id.toString(),
  //   placeId2: place?._id,
  // });

  const allRooms = await Room.find({
    placeId: place?._id,
  });
  if (!allRooms) {
    console.log('No rooms found');
    return;
  }

  allRooms?.map(async (room) => {
    const roomId = room?._id;
    updateRoomsInternally(place, roomId);
  });
};

const updateRoomsInternally = asyncHandler(async (place, roomId) => {
  const roomDoc = await Room.findById(roomId);

  if (roomDoc) {
    roomDoc.title = place?.title || roomDoc.title;
    roomDoc.type = place?.type || roomDoc.type;
    roomDoc.city = place?.city || roomDoc.city;
    roomDoc.description = place?.description || roomDoc.description;
    roomDoc.perks = place?.perks || roomDoc.perks;
    roomDoc.checkIn = place?.checkIn || roomDoc.checkIn;
    roomDoc.checkOut = place?.checkOut || roomDoc.checkOut;
    roomDoc.paymentOptions = place?.paymentOptions || roomDoc.paymentOptions;
  }
  const updatedRoom = await roomDoc.save();
  console.log('ok');
  // console.log({ updatedRoom: updatedRoom });

  // res.status(200).json(updatedRoom);
});

const updatePlaces = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const userId = user._id;

  const {
    id,
    title,
    address,
    city,
    type,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    isAvailable,
    paymentOptions,
  } = req.body;

  const place = await Place.findById(id);

  // if place doesnt exist
  if (!place) {
    res.status(404);
    throw new Error('place not found');
  }
  // Match place to its user
  if (place.owner.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  let availability = true;

  if (isAvailable === 'false') {
    availability = false;
  }

  // Update place
  const updatedPlace = await Place.findByIdAndUpdate(
    { _id: id },
    {
      title,
      address,
      city,
      type,
      photos: addedPhotos ? addedPhotos : place.addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      isAvailable: availability,
      paymentOptions,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (updatedPlace) {
    await updateRoomData(updatedPlace); // update all rooms in place

    res.status(200).json(updatedPlace);
  }
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
  // owner can delete or modify a listing
  // Match place to its user
  if (place.owner.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

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

  if (place.owner.toString() !== req.user.id) {
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
    place.rooms.map(({ roomId }) => {
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
  res.json(roomDoc);
});

// Update Product
// ad city to rooms
const updateRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Both are thesame
  // console.log({user1: user})

  // const user2 = await User.findById(req.user.id);// Both are thesame
  // console.log({user2: user2})
  // const userId = user._id;
  const {
    roomId,
    placeId,
    title,
    type,
    city,
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
    paymentOptions,
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

  const roomDoc = await Room.findById(roomId);
  if (req.user.id === roomDoc.owner.toString()) {
    if (roomDoc) {
      roomDoc.title = title || roomDoc.title;
      roomDoc.placeId = placeId || roomDoc.placeId;
      roomDoc.type = type || roomDoc.type;
      roomDoc.city = city || roomDoc.city;
      roomDoc.photos = addedPhotos || roomDoc.photos;
      roomDoc.description = description || roomDoc.description;
      roomDoc.price = price || roomDoc.price;
      roomDoc.perks = perks || roomDoc.perks;
      roomDoc.extraInfo = extraInfo || roomDoc.extraInfo;
      roomDoc.checkIn = checkIn || roomDoc.checkIn;
      roomDoc.checkOut = checkOut || roomDoc.checkOut;
      roomDoc.maxGuests = maxGuests || roomDoc.maxGuests;
      roomDoc.isAvailable = availability || roomDoc.isAvailable;
      roomDoc.paymentOptions = paymentOptions || roomDoc.paymentOptions;
      roomDoc.unavailableDates = unavailableDates || roomDoc.unavailableDates;
      roomDoc.roomNumber = roomNumber || roomDoc.roomNumber;
      roomDoc.roomPerks = roomPerks || roomDoc.roomPerks;
      roomDoc.roomType = roomType || roomDoc.roomType;
      roomDoc.rating = rating || roomDoc.rating;
    }
    const updatedRoom = await roomDoc.save();
    // res.json('ok');
    res.status(200).json(updatedRoom);
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
  const room = await Room.findById(id).populate('owner');
  if (room) {
    console.log({ roomActive: room });
    res.status(200).json(room);
  }

  // res.json(await Room.findById(id));
});

// const getOneRoom = asyncHandler(async (req, res) => {
//   const room = await Room.findById(req.params.id);
//   res.status(200).json(room);
// });
// const getAllRooms = asyncHandler(async (req, res) => {
//   // const rooms = await Room.find();
//   // res.status(200).json(rooms);
//   res.json(await Room.find());
// });

const getAllRooms1 = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  res.status(200).json(rooms);
});

const getAllRooms = asyncHandler(async (req, res) => {

  const rooms = await Room.find();
  res.status(200).json(rooms);
});

const getUserRooms = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const response = await Room.find({
    owner: user._id,
    placeId: req.params.placeId,
  });

  if (response) {
    res.json(response);
  }
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

const getRoomsByFilter = asyncHandler(async (req, res) => {
  const { min, max, ...others } = req.query;

  const rooms = await Room.find({
    ...others,
    // cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    // price: { $gt: min | 1, $lt: max || 999 },
    price: { $gt: min | 1, $lt: max || 999 },
  }).limit(req.query.limit);

  console.log({ searchedRooms: rooms });
  res.status(200).json(rooms);
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
  getRoomsByFilter,
};
