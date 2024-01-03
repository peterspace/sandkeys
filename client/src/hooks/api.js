import axios from 'axios';
// import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const updateRequest = async ({ url, data }) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}${url}`, data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log({ errorMessage: message });
    // toast.error(message);
  }
};

export const fetchRequest = async ({ url }) => {
  try {
    const response = await axios.get(`${BACKEND_URL}${url}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log({ errorMessage: message });
    // toast.error(message);
  }
};

export const postRequest = async ({ url, data }) => {
  try {
    const response = await axios.post(`${BACKEND_URL}${url}`, data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log({ errorMessage: message });
    // toast.error(message);
  }
};



export const deletRequest = async ({ url}) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}${url}`);
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.log({ errorMessage: message });
    // toast.error(message);
  }
};


//===={Me}=======
export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append('file', uploadFile);
  formData.append('upload_preset', 'kxxtmdn1');

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/datkh2oxv/image/upload/',
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};


export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
}) => {
  const params = new URLSearchParams();

  if (pageNum && pageNum > 1) {
    params.set('page', pageNum);
  }

  if (query) {
    params.set('search', query);
  }

  if (cmpLoc) {
    params.set('location', cmpLoc);
  }

  if (sort) {
    params.set('sort', sort);
  }

  if (jType) {
    params.set('jtype', jType);
  }

  if (exp) {
    params.set('exp', exp);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
