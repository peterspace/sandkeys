import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const createReservation = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/reservations`, userData);
  return response.data;
};

const getUserReservations = async () => {
  const response = await axios.get(`${BACKEND_URL}/reservations`);
  return response.data;
};

const getOneUserReservation = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/reservations/${id}`);
  return response.data;
};

const getOneUserReservationInternal = async (userData) => {
  const response = userData;
  return response;
};

const getOwnerReservations = async () => {
  const response = await axios.get(
    `${BACKEND_URL}/reservations/getOwnerReservations`
  );
  return response.data;
};

const getOneOwnerReservation = async (id) => {
  const response = await axios.get(
    `${BACKEND_URL}/reservations/getOneOwnerReservation/${id}`
  );
  return response.data;
};

//===================================================

const getReservationsApproval = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/reservations`, userData);
  return response.data;
};

//

const reservationNotificationOwner = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/reservations/reservationNotificationOwner`,
    userData
  );
  return response.data;
};
const bookingService = {
  createReservation, //
  getUserReservations,
  getOneUserReservation,
  getOneUserReservationInternal,
  getOwnerReservations,
  getOneOwnerReservation,
  getReservationsApproval,
  reservationNotificationOwner,
};

export default bookingService;
