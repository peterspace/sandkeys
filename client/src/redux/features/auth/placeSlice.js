import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  placeId: '',
  title: null,
  city: null,
  address: null,
  type: null,
  addedPhotos: null,
  description: null,
  perks: null,
  extraInfo: null,
  isAvailable: null,
  paymentOptions: null,
  checkIn: null,
  checkOut: null,
  rooms: null,
  perks: null,
  rating: null,
};

// placeId: place?._id,
//       title: place?.title,
//       city: place?.city,
//       address: place?.address,
//       description: place?.description,
//       extraInfo: place?.extraInfo,
//       checkIn: place?.checkIn,
//       checkOut: place?.checkOut,
//       paymentOptions: place?.paymentOptions,
// // name: name ? name : "",

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    updateType(state, action) {
      state.type = action.payload;
    },
    updateTitle(state, action) {
      state.title = action.payload;
    },
    updateCity(state, action) {
      state.city = action.payload;
    },
    updateAddress(state, action) {
      state.address = action.payload;
    },
    updateDescription(state, action) {
      state.description = action.payload;
    },
    updateExtraInfo(state, action) {
      state.extraInfo = action.payload;
    },
    updateCheckIn(state, action) {
      state.checkIn = action.payload;
    },
    updateCheckOut(state, action) {
      state.checkOut = action.payload;
    },
    updatePlaceId(state, action) {
      state.placeId = action.payload;
    },
    updatePerks(state, action) {
      state.perks = action.payload;
    },
    updateRating(state, action) {
      state.rating = action.payload;
    },
  },
});

export const {
  updateType,
  updateTitle,
  updateCity,
  updateAddress,
  updateDescription,
  updateCheckIn,
  updateCheckOut,
  updateExtraInfo,
  updatePlaceId,
  updatePerks,
  updateRating,
} = placeSlice.actions;

// export const selectType = (state) => state.place.type;
// export const selectCity = (state) => state.place.city;
// export const selectCheckIn = (state) => state.place.checkIn;
// export const selectCheckOut = (state) => state.place.checkOut;
// export const selectGuestNumber = (state) => state.place.guestNumber;
// export const selectGuestName = (state) => state.place.guestName;
// export const selectGuestPhone = (state) => state.place.guestPhone;
// export const selectIsPaymentCompleted = (state) =>
//   state.place.isPaymentCompleted;
// export const selectOwnerId = (state) => state.place.ownerId;

export default placeSlice.reducer;
