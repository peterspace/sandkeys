import axios from "axios";
import { BACKEND_URL } from '../baseURL';


const getCoupons = async () => {
  const response = await axios.get(`${BACKEND_URL}/coupon/`);

  return response.data;
};

const createCoupons = async (coupon) => {
  const response = await axios.post(`${BACKEND_URL}/coupon/` );

  return response.data;
};
const updateCoupon = async (coupon) => {
  const response = await axios.put(
    `${BACKEND_URL}/coupon/${coupon.id}`,
    {
      name: coupon.couponData.name,
      expiry: coupon.couponData.expiry,
      discount: coupon.couponData.discount,
    },
    
  );

  return response.data;
};
const getCoupon = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/coupon/${id}`);

  return response.data;
};

const deleteCoupon = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/coupon/${id}`);

  return response.data;
};
const couponService = {
  getCoupons,
  createCoupons,
  deleteCoupon,
  getCoupon,
  updateCoupon,
};

export default couponService;
