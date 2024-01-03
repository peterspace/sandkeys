import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  city: '',
  type: '',
  checkIn: null,
  checkOut: null,
  // guestNumber: 1,
  guestNumber: null,
  guestName: null,
  guestPhone: null,
  isPaymentCompleted: false,
  ownerId: "",
};

// name: name ? name : "",

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setType(state, action) {
      state.type = action.payload;
    },
    setCity(state, action) {
      state.city = action.payload;
    },
    setCheckIn(state, action) {
      state.checkIn = action.payload;
    },
    setCheckOut(state, action) {
      state.checkOut = action.payload;
    },
    setGuestNumber(state, action) {
      state.guestNumber = action.payload;
    },
    setGuestName(state, action) {
      state.guestName = action.payload;
    },
    setGuestPhone(state, action) {
      state.guestPhone = action.payload;
    },
    setIsPaymentCompleted(state, action) {
      state.isPaymentCompleted = action.payload;
    },
    setOwnerId(state, action) {
      state.ownerId = action.payload;
    },
  },
});

export const {
  setType,
  setCity,
  setCheckIn,
  setCheckOut,
  setGuestNumber,
  setGuestName,
  setGuestPhone,
  setIsPaymentCompleted,
  setOwnerId,

} = bookingSlice.actions;

export const selectType = (state) => state.booking.type;
export const selectCity = (state) => state.booking.city;
export const selectCheckIn = (state) => state.booking.checkIn;
export const selectCheckOut = (state) => state.booking.checkOut;
export const selectGuestNumber = (state) => state.booking.guestNumber;
export const selectGuestName = (state) => state.booking.guestName;
export const selectGuestPhone = (state) => state.booking.guestPhone;
export const selectIsPaymentCompleted = (state) => state.booking.isPaymentCompleted;
export const selectOwnerId = (state) => state.booking.ownerId;

export default bookingSlice.reducer;
