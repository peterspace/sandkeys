import axios from 'axios';
import { BACKEND_URL } from '../baseURL';

const postQuery = async (contactData) => {
  const response = await axios.post(`${BACKEND_URL}/enquiry`, contactData);

  return response.data;
};

const contactService = {
  postQuery,
};

export default contactService;
