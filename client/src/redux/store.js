import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/features/auth/authSlice';
// import bookingReducer from './features/auth/bookingSlice';
import bookingReducer from './features/booking/bookingSlice';
import reservationReducer from './features/reservation/reservationSlice';

// import placeReducer from './features/auth/placeSlice';
import placeReducer from './features/place/placeSlice';

import blogReducer from './features/blog/blogSlice';
import contactReducer from './features/contact/contactSlice';
import enquiryReducer from './features/enquiry/enquirySlice';
import userReducer from './features/user/userSlice';
import couponReducer from './features/coupon/couponSlice';

import { combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  booking: bookingReducer,
  reservation: reservationReducer,
  place: placeReducer,
});

export const store = configureStore({
  reducer,
});
