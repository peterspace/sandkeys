import axios from 'axios';
import { BACKEND_URL } from '../baseURL';

const getEnquiries = async () => {
  const response = await axios.get(`${BACKEND_URL}/enquiry/`);

  return response.data;
};
const deleteEnquiry = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/enquiry/${id}`);
  return response.data;
};
const getEnquiry = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/enquiry/${id}`);
  return response.data;
};
const udpateEnquiry = async (enq) => {
  const response = await axios.put(`${BACKEND_URL}/enquiry/${enq.id}`, {
    status: enq.enqData,
  });
  return response.data;
};
const enquiryService = {
  getEnquiries,
  deleteEnquiry,
  getEnquiry,
  udpateEnquiry,
};

export default enquiryService;
