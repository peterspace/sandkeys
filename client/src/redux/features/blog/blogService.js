import axios from 'axios';
import { BACKEND_URL } from '../baseURL';

const getBlogs = async () => {
  const response = await axios.get(`${BACKEND_URL}/blog/`);

  return response.data;
};

const getBlog = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/blog/${id}`);

  return response.data;
};

const blogService = {
  getBlogs,
  getBlog,
};

export default blogService;
