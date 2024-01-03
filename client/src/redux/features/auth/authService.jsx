import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//======{facebook}==============================
const loginFacebook = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/facebook/login`);

  return response.data;
};
const loginCallbackFacebook = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/facebook/login/callback`);

  return response.data;
};
const loginSuccessFacebook = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/facebook/login/success`);

  return response.data;
};
const loginErrorFacebook = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/facebook/login/error`);

  return response.data;
};
const registerFacebook = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/facebook/register`);

  return response.data;
};
const registerCallbackFacebook = async () => {
  const response = await axios.get(
    `${BACKEND_URL}/auth/facebook/register/callback`
  );

  return response.data;
};
const registerSuccessFacebook = async () => {
  const response = await axios.get(
    `${BACKEND_URL}/auth/facebook/register/success`
  );

  return response.data;
};
const registerErrorFacebook = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/facebook/register/error`);

  return response.data;
};

//======{google}==============================
const loginGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/login`);

  return response.data;
};
const loginCallbackGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/login/callback`);

  return response.data;
};
const loginSuccessGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/login/success`);

  return response.data;
};
const loginErrorGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/login/error`);

  return response.data;
};
const registerGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/register`);

  return response.data;
};
const registerCallbackGoogle = async () => {
  const response = await axios.get(
    `${BACKEND_URL}/auth/google/register/callback`
  );

  return response.data;
};
const registerSuccessGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/register/success`);

  return response.data;
};
const registerErrorGoogle = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/google/register/error`);

  return response.data;
};

//======{local}==============================
const loginLocal = async (userData) => {
  const response = await axios.post(`${BACKEND_URL}/auth/local`, userData);

  return response.data;
};
const registerLocal = async (userData) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/local/register`,
    userData
  );

  return response.data;
};
const loginSuccessLocal = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/local/success`);

  return response.data;
};
const loginErrorLocal = async () => {
  const response = await axios.get(`${BACKEND_URL}/auth/local/error`);

  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${BACKEND_URL}/auth/logout`);

  return response.data;
};

const authService = {
  //======{facebook}==============================
  loginFacebook,
  loginCallbackFacebook,
  loginSuccessFacebook,
  loginErrorFacebook,
  registerFacebook,
  registerCallbackFacebook,
  registerSuccessFacebook,
  registerErrorFacebook,
  //======{Google}==============================
  loginGoogle,
  loginCallbackGoogle,
  loginSuccessGoogle,
  loginErrorGoogle,
  registerGoogle,
  registerCallbackGoogle,
  registerSuccessGoogle,
  registerErrorGoogle,
  //======{local}==============================
  loginLocal,
  registerLocal,
  loginSuccessLocal,
  loginErrorLocal,
  logout,
};

export default authService;

// const   logout = async (contactData) => {
//   const response = await axios.get(`${BACKEND_URL}enquiry`, contactData);

//   return response.data;
// };
