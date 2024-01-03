import axios from 'axios';
import { BACKEND_URL } from '../baseURL';

// Login User
const loginUser = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/users/login`, userData);
  if (response.statusText === 'OK') {
    toast.success('Login Successful...');
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Register User
const registerUser = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/users/register`, userData, {
    withCredentials: true,
  });
  if (response.statusText === 'OK') {
    toast.success('User Registered successfully');
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout User
const logoutUser = async () => {
  await axios.get(`${BACKEND_URL}/users/logout`);
  localStorage.removeItem('user');
};

const getUserWishlist = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/wishlist`);
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/user/cart`, userData);
  if (response.data) {
    return response.data;
  }
};

// Get getUser's Cart Items
const getCart = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/cart`);
  if (response.data) {
    return response.data;
  }
};

const removeRoomFromCart = async (cartItemId) => {
  const response = await axios.delete(
    `${BACKEND_URL}/delete-product-cart/${cartItemId}`
  );
  if (response.data) {
    return response.data;
  }
};

const updateCartRoom = async (cartDetail) => {
  const response = await axios.put(
    `${BACKEND_URL}/update-product-cart/${cartDetail.cartItemId}/${cartDetail.newQuantity}`
  );
  if (response.data) {
    return response.data;
  }
};

const getOrders = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/getallorders`);

  return response.data;
};
const getOrderByUser = async (id) => {
  const response = await axios.post(`${BACKEND_URL}/user/getorderbyuser/${id}`);

  return response.data;
};

//============{new}===========================================

const emptyCart = async (userData) => {
  const response = await axios.delete(
    `${BACKEND_URL}/user/empty-cart`,
    userData
  );
  if (response.data) {
    return response.data;
  }
};

// Forgot Password
const forgotPassword = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/users/forgotpassword`,
    userData
  );
  return response.data.message;
};

// Reset Password
const resetPassword = async (userData, resetToken) => {
  const response = await axios.put(
    `${BACKEND_URL}/users/resetpassword/${resetToken}`,
    userData
  );
  return response.data;
};

// Update Profile
const changePassword = async (userData) => {
  const response = await axios.patch(
    `${BACKEND_URL}/users/changepassword`,
    userData
  );
  return response.data;
};
// Update password
const updatePassword = async (userData) => {
  const response = await axios.put(`${BACKEND_URL}/user/password`, userData);
  if (response.data) {
    return response.data;
  }
};

const applyCoupon = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/user/cart/applycoupon`,
    userData
  );
  if (response.data) {
    return response.data;
  }
};

const createOrder = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/user/cart/cash-order`,
    userData
  );
  if (response.data) {
    return response.data;
  }
};

// get all orders by userId
const getUserOrders = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/user/getorderbyuser/${id}`);
  if (response.data) {
    return response.data;
  }
};

const getUserOders = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/cart`);
  if (response.data) {
    return response.data;
  }
};

// Get User Profile
const getUser = async () => {
  const response = await axios.get(`${BACKEND_URL}/users/getuser`);
  return response.data;
};

// Update Profile
const updateUser = async (userData) => {
  const response = await axios.put(`${BACKEND_URL}/user/edit-user`, userData);
  if (response.data) {
    return response.data;
  }
};

// Update Profile
const saveAddress = async (userData) => {
  const response = await axios.put(
    `${BACKEND_URL}/user/save-address`,
    userData
  );
  if (response.data) {
    return response.data;
  }
};

// Get Login Status
const getLoginStatus = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/loggedin`);
  if (response.data) {
    return response.data;
  }
};

//============{New Line}==============
// Register User
const registerAgent = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/users/register/partner`,
    userData,
    {
      withCredentials: true,
    }
  );
  if (response.statusText === 'OK') {
    toast.success('User Registered successfully');
  }
  return response.data;
};

const registerAdmin = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/users/register/admin`,
    userData,
    {
      withCredentials: true,
    }
  );
  if (response.statusText === 'OK') {
    toast.success('User Registered successfully');
  }
  return response.data;
};

//====================================================================================
// getAllUsers
const getAllUsers = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/getAllUsers`);
  if (response.data) {
    return response.data;
  }
};

// getAllAgents
const getAllAgents = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/getAllAgents`);
  if (response.data) {
    return response.data;
  }
};

// getAllAdmins
const getAllAdmins = async () => {
  const response = await axios.get(`${BACKEND_URL}/user/getAllAdmins`);
  if (response.data) {
    return response.data;
  }
};

export const userService = {
  loginUser,
  registerUser,
  logoutUser,
  getUserWishlist,
  addToCart,
  getCart,
  removeRoomFromCart,
  updateCartRoom,
  getOrders,
  getOrderByUser,
  //==================================
  emptyCart,
  forgotPassword,
  resetPassword,
  changePassword,
  updatePassword,
  applyCoupon,
  createOrder,
  getUserOrders,
  getUserOders,
  getUser,

  updateUser,
  saveAddress,
  getLoginStatus,
  //============{User Data}==================
  registerAgent,
  registerAdmin,
  //============{User Data}==================
  getAllUsers,
  getAllAgents,
  getAllAdmins,
};
