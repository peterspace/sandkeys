const express = require('express');
const router = express.Router();
const { protect, isAdmin, isPartner } = require('../middleWare/authMiddleware');

// const protectAdmin = require('../middleWare/adminMiddleware');
const {
  createPlace,
  getUserPlaces,
  getOnePlace,
  updatePlaces,
  getRoomsInOnePlace, // not in use currently
  getAllPlaces,
  getAllPlacesByCityAndType,
  deletePlace,
  //=========={new}===========================
  updatePlace,
  // getPlaces,
  countByType,
  countByCity,
  getPlaceRooms,
  // updatePlaceAvailability,

  //=========={Rooms}===========================
  createRoom,
  deleteRoom,
  getOneRoom,
  getAllRooms,
  updateRoom,
  updateRoomAvailability,
  getUserRooms,
  getAllAvailableRooms,
  getAllAvailableRoomsByCityAndType,
  addToWishlist,
  rating,
  getRoomsByFilter,
} = require('../controllers/placeController');

// router.get('/', getAllPlaces);
router.get('/allplaces/', getAllPlaces);
router.get('/allplaces/:city/:type', getAllPlacesByCityAndType);
router.get('/user-places', protect, getUserPlaces); // modified
router.get('/:id', getOnePlace); // modified
router.get('/allroomsInOnePlace/:id', getRoomsInOnePlace); // modified

//========={Admin only}============================
router.post('/', protect, isPartner, createPlace);
router.patch('/', protect, isPartner, updatePlaces);

//=========={new}===========================
router.delete('/:id', protect, deletePlace); // new
router.put('/:id', protect, isPartner, updatePlace); // check
router.get('/countByCity', countByCity);
router.get('/countByType', countByType);
//router.put("/available/:id", protect,  updatePlaceAvailability);// check : send during booking request

//=========={Not in use currently}===========================
// router.get('/', getPlaces);
// router.get('/find/:id', getPlaces);
router.get('/placerooms/:id', getPlaceRooms);

//======={Rooms}=================

//CREATE

router.get('/rooms/allRooms', getAllRooms);
router.post('/rooms', protect, createRoom);

//UPDATE
router.put(
  '/rooms/availability/:id',
  protect,
  isPartner,
  updateRoomAvailability
);
// router.put('/rooms', protect, updateRoom);
router.patch('/rooms', protect, isPartner, updateRoom);
// router.patch('/rooms', protect, updateRoom);

//DELETE
router.delete('/rooms/:id/:placeId', protect, deleteRoom);
//GET

router.get('/rooms/:id', getOneRoom);
//GET ALL

router.get('/rooms/user-rooms/:placeId', protect, getUserRooms); // modified
router.get('/allavailablerooms', getAllAvailableRooms);
router.get(
  '/allroomsbycityandtype/:city/:type',
  getAllAvailableRoomsByCityAndType
);

router.post('/addToWishlist', protect, addToWishlist);
router.post('/rating', protect, rating);
router.get('/rooms/getRoomsByFilter', getRoomsByFilter); // modified

//
module.exports = router;
