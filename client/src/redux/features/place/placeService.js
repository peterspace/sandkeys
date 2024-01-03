import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const createPlace = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/places`, userData);
  return response.data;
};

const getUserPlaces = async () => {
  const response = await axios.get(`${BACKEND_URL}/places/user-places`);
  return response.data;
};

// const getOnePlace = async (id) => {
//   const response = await axios.get(`${BACKEND_URL}/places/${id}`);
//   return response.data;
// };

// const updatePlaces = async (userData) => {
//   const response = await axios.put(`${BACKEND_URL}/places`, userData);
//   return response.data;
// };

const getOnePlace = async (response) => {
  if(response){
    return response;
  }
 
};

const updatePlaces = async (userData) => {
  const response = await axios.patch(`${BACKEND_URL}/places`, userData);
  return response.data;
};

// all rooms in one hotel or place
const getPlaceRooms = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/places/placerooms/${id}`);
  return response.data;
};

// const updatePlace = async (id) => {
//   const response = await axios.put(`${BACKEND_URL}/places/${id}`);
//   return response.data;
// };

const updatePlace = async (id) => {
  const response = await axios.patch(`${BACKEND_URL}/places/${id}`);
  return response.data;
};

const deletePlace = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/places/${id}`);
  return response.data;
};

const countByCity = async () => {
  const response = await axios.get(
    `${BACKEND_URL}/places/countByCity?cities=moscow,saint-petersburg,dubai`
  );
  return response.data;
};

const countByType = async () => {
  const response = await axios.get(`${BACKEND_URL}/places/countByType`);
  return response.data;
};

const getAllPlaces = async () => {
  const response = await axios.get(`${BACKEND_URL}/places/allplaces`);
  return response.data;
};

const getAllPlacesByCityAndType = async (city, type) => {
  const response = await axios.get(
    `${BACKEND_URL}/places/allplaces/${city}/${type}`
  );
  return response.data;
};

const addToWishlist = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/places/addToWishlist`);
  return response.data;
};

const rating = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/places/rating`, userData);
  return response.data;
};

const createRoom = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/places/rooms`, userData);
  return response.data;
};

const updateRoomAvailability = async (id) => {
  const response = await axios.put(
    `${BACKEND_URL}/places/rooms/availability/${id}`
  );
  return response.data;
};
// const updateRoom = async (userData) => {
//   const response = await axios.put(`${BACKEND_URL}/places/rooms`, userData);
//   return response.data;
// };
const updateRoom = async (userData) => {
  const response = await axios.patch(`${BACKEND_URL}/places/rooms`, userData);
  return response.data;
};

const deleteRoom = async (id, placeId) => {
  const response = await axios.delete(
    `${BACKEND_URL}/places/rooms/${id}/${placeId}`
  );
  return response.data;
};

const getOneRoom = async (id) => {
  const response = await axios.get(
    `${BACKEND_URL}/places/rooms/${id}`
  );
  return response.data;
};

// const getAllRooms = async () => {
//   const response = await axios.get(
//     `${BACKEND_URL}/places/rooms/allRooms`
//   );
//   return response.data;
// };

const getAllRooms = async (response) => {
  if(response){
    return response;
  }
 
};

const getUserRooms = async (placeId) => {
  const response = await axios.get(
    `${BACKEND_URL}/places/rooms/user-rooms/${placeId}`
  );
  return response.data;
};

const  getAllAvailableRooms = async () => {
  const response = await axios.get(
    `${BACKEND_URL}/places/allavailablerooms`
  );
  return response.data;
};

const  getAllAvailableRoomsByCityAndType = async (city, type) => {
  const response = await axios.get(
    `${BACKEND_URL}/places/allroomsbycityandtype/${city}/${type}`
  );
  return response.data;
};


const placeService = {
  createPlace,
  getUserPlaces,
  getOnePlace,
  updatePlaces,
  getAllPlaces,
  getAllPlacesByCityAndType,
  //==========={new}=================================
  deletePlace,
  updatePlace,
  //getRoomsInOnePlace,// not in use currently
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

export default placeService;
