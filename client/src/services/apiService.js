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

// Register User
export const registerSocial = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/registerSocial`,
      userData,
      { withCredentials: true }
    );
    if (response.data) {
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
// loginSocial
export const loginSocial = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/loginSocial`,
      userData,
      { withCredentials: true }
    );
    if (response.data) {
      toast.success('User Registered successfully');
      return response.data;
    }
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

//======================================================={Facebook}==============================================================================

// Register User
export const authenticateUserFacebook = async () => {
  try {
    // const response = await axios.get(`${BACKEND_URL}/auth/facebook`);
    const response = await axios.get(`${BACKEND_URL}/users/loginFacebook`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// /success callback
export const successUserFacebook = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/facebook/success`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// /success callback
export const errorUserFacebook = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/facebook/error`);
    if (response.data) {
      toast.success('Error authentication via Facebook...');
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//======================================================={Google}==============================================================================

export const authenticateUserGoogle = async () => {
  try {
    // const response = await axios.get(`${BACKEND_URL}/auth/google`);
    // const response = await axios.get(`${BACKEND_URL}/users/loginGoogle`);
    const response = await axios.get(`${BACKEND_URL}/auth/google`);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// /success callback
export const successUserGoogle = async () => {
  try {
    // const response = await axios.get(`${BACKEND_URL}/auth/google/success`);
    const response = await axios.get(`${BACKEND_URL}/users/loginByGoogle`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// /success callback
export const errorUserGoogle = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/google/error`);
    if (response.data) {
      toast.success('Error authentication via Google...');
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//=====================================================================================================================================

// Logout User
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/users/logout`);
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

// Forgot Password
export const forgotOtp = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/forgotOtp`,
      userData
      // {
      //   headers: {
      //     "Access-Control-Allow-Origin": "*",
      //   },
      // },
      // { withCredentials: true }
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
export const verifyOtp = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/verifyOtp`,
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
// export const getUserPlaces = async () => {
//   try {
//     const response = await axios.get(`${BACKEND_URL}/places/user-places`);
//     // return response.data;
//     return response;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

export const getUserPlaces = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/places/user-places`);
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

export const getOwnerBookings = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/bookings/ownerbookings`);
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

export const getOneOwnerBookings = async (id) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getOneOwnerBooking/${id}`
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

export const getAllInactiveBookings = async (ownerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getAllInactiveBookings/${ownerId}`
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
    const response = await axios.get(`${BACKEND_URL}/places/rooms`);
    // return response.data;
    if (response?.data) {
      return response;
    }
    // return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const createUserRooms = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/places/rooms`, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const updateUserRooms = async (userData) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/places/rooms`, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const createUserPlace = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/places`, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const updateUserPlace = async (userData) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/places`, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getUserBookingById = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/bookings/${id}`);
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

export const bookingConfirmation = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/bookings/bookingConfirmation`,
      userData
    );

    if (response.statusText === 'OK') {
      toast.success('booking successful');
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

export const getBookingApproval = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/bookings/getBookingApproval`,
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

export const bookingNotificationOwner = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/bookings/bookingNotificationOwner`,
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

export const bookingNotificationUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/bookings/bookingNotificationUser`,
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

export const paymentConfirmation = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/bookings/paymentConfirmation`,
      userData
    );
    if (response.statusText === 'OK') {
      toast.success('payment successful');
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

export const registrationConfirmation = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/registrationConfirmation`,
      userData
    );
    if (response.statusText === 'OK') {
      toast.success('registration confirmation');
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

// export const createYandexPay = async (userData) => {

//   console.log({newData: userData})
//   try {
//     const response = await axios.post(
//       `${BACKEND_URL}/bookings/payment/yandex/createYandexPay`,
//       userData
//     );
//     if (response.data) {
//       toast.success('invoice created');
//     }

//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const createYandexPay = async (userData) => {

//   console.log({newData: userData})
//   try {
//     const response = await axios.post(
//       `${BACKEND_URL}/bookings/createYandexPay`,
//       userData
//     );
//     if (response.data) {
//       toast.success('invoice created');
//     }

//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

export const createYandexPay = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/bookings/createYandexPay`,
      userData
    );
    if (response.data) {
      toast.success('invoice created');
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

export const getYandexPayment = async (paymentId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getYandexPayment/${paymentId}`
    );
    if (response.data) {
      toast.success('invoice created');
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

//================{RESERVATIONS}================================================

export const getReservationsApproval = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/reservations/getReservationsApproval`,
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

export const getOneUserReservationService = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/reservations/${id}`);
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

export const createReservationService = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/reservations`, userData);
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

export const getRoomsByBookingDateService = async (roomId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/bookings/getRoomsByBookingDate/${roomId}`
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
