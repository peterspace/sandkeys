import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

 const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};





// Get Login Status
 const getLoginStatus = async () => {
  const response = await axios.get(`${BACKEND_URL}/users/loggedin`);
  return response.data;
};

// Update Profile
 const updateUser = async (formData) => {
  const response = await axios.patch(
    `${BACKEND_URL}/users/updateuser`,
    formData
  );
  return response.data;
};
// Update Profile
 const changePassword = async (formData) => {
  const response = await axios.patch(
    `${BACKEND_URL}/users/changepassword`,
    formData
  );
  return response.data;
};

// Get User Profile
 const getUserPlaces = async () => {
  const response = await axios.get(`${BACKEND_URL}/places/user-places`);

  return response;
};

 const getUserBookings = async () => {
  const response = await axios.get(`${BACKEND_URL}/bookings`);

  return response.data;
};

// Get User Profile
 const createBooking = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/bookings`, userData);
  if (response.statusText === 'OK') {
    toast.success('Booking successfully');
  }
  return response.data;
};

 

 const findUser = async () => {
  const response = await axios.get(`${BACKEND_URL}/users/findUser`);
  return response.data;
};

 const getOwnerBookings = async (ownerId) => {
  const response = await axios.get(
    `${BACKEND_URL}/bookings/ownerbookings/${ownerId}`
  );
  return response.data;
};

 const getAllPaidBookings = async (ownerId) => {
  const response = await axios.get(
    `${BACKEND_URL}/bookings/getAllPaidBookings/${ownerId}`
  );
  return response.data;
};

 const getAllPendingBookings = async (ownerId) => {
  const response = await axios.get(
    `${BACKEND_URL}/bookings/getAllPendingBookings/${ownerId}`
  );
  return response.data;
};

 const getAllActiveBookings = async (ownerId) => {
  const response = await axios.get(
    `${BACKEND_URL}/bookings/getAllActiveBookings/${ownerId}`
  );
  return response.data;
};

 const getAllCompletedBookings = async (ownerId) => {
  const response = await axios.get(
    `${BACKEND_URL}/bookings/getAllCompletedBookings/${ownerId}`
  );
  return response.data;
};

 const getAllCanceledBookings = async (ownerId) => {
  const response = await axios.get(
    `${BACKEND_URL}/bookings/getAllCanceledBookings/${ownerId}`
  );
  return response.data;
};

// Update Profile
 const updateOwnerBooking = async (userData) => {
  const response = await axios.put(`${BACKEND_URL}/bookings`, userData);
  return response.data;
};

 const getAllBookings = async () => {
  const response = await axios.get(`${BACKEND_URL}/bookings/allbookings`);
  return response.data;
};

// Get User Profile
 const getUserRooms = async (placeId) => {
  const response = await axios.get(
    `${BACKEND_URL}/places/rooms/user-rooms/${placeId}`
  );
  return response;
};

//================{ROOMS}================================================
