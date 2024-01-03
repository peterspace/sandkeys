import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/register`,
      userData,
      { withCredentials: true }
    );
    if (response.statusText === 'OK') {
      toast.success('User Registered successfully');
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/users/login`, userData);
    if (response.statusText === 'OK') {
      toast.success('Login Successful...');
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/users/logout`);
    localStorage.removeItem('user');
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Forgot Password
export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Reset Password
export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/users/resetpassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/loggedin`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Get User Profile
export const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/getuser`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Update Profile
export const updateUser = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/users/updateuser`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Update Profile
export const changePassword = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/users/changepassword`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get User Profile
export const getUserPlaces = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/places/user-places`);
    // return response.data;
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getUserBookings = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/bookings`);
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get User Profile
export const createBooking = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/bookings`, userData);
    if (response.statusText === 'OK') {
      toast.success('Booking successfully');
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getPlaces = async (city, type) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/places/allplaces/${city}/${type}`
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const countByCity = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/places/countByCity?cities=moscow,saint-petersburg,dubai`
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const countByType = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/places/countByType`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// axios.get(`/places/${id}`)
export const getPlace = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/places/${id}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const findUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/findUser`);
    return response.data;
    // return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getOwnerBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/ownerbookings/${ownerId}`
    );
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getAllPaidBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getAllPaidBookings/${ownerId}`
    );
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getAllPendingBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getAllPendingBookings/${ownerId}`
    );
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getAllActiveBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getAllActiveBookings/${ownerId}`
    );
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getAllCompletedBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getAllCompletedBookings/${ownerId}`
    );
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getAllCanceledBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getAllCanceledBookings/${ownerId}`
    );
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Update Profile
export const updateOwnerBooking = async (userData) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/bookings`, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const updateBookingsAutomatically = async (userData) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/bookings/updateBookingStatus`,
      userData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// export const updateOwnerBooking = async (userData) => {
//   try {
//     const response = await axios.patch(
//       `${BACKEND_URL}/bookings`,
//       userData
//     );
//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/bookings/allbookings`);
    // return response.data;
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get User Profile
export const getUserRooms = async (placeId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/places/rooms/user-rooms/${placeId}`
    );
    // return response.data;
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const stripeCheckOut = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/payment/stripCheckout`,
      userData
    );
    if (response.statusText === 'OK') {
      toast.success('Payment successful');
    }
    // return response.data;
    // return response;

    return response.data.success;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const stripeCheckOutSession = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/payment/create-checkout-session`,
      userData
    );
    if (response.statusText === 'OK') {
      toast.success('Payment successful');
    }
    // return response.data;
    // return response;

    return response.data.url;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//================{ROOMS}================================================
