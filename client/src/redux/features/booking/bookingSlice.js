import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import bookingService from './bookingService';


export const createBooking = createAsyncThunk(
  'bookings/create',
  async (userData, thunkAPI) => {
    try {
      return await bookingService.createBooking(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserBookings = createAsyncThunk(
  'bookings/getuserbookings',
  async (thunkAPI) => {
    try {
      return await bookingService.getUserBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateOwnerBooking = createAsyncThunk(
  'booking/getAbooking',
  async (userData, thunkAPI) => {
    try {
      return await bookingService.updateOwnerBooking(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOneUserBooking = createAsyncThunk(
  'booking/getOneUserBooking',
  async (id, thunkAPI) => {
    try {
      return await bookingService.getOneUserBooking(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const getOwnerBookings = createAsyncThunk(
  'booking/getOwnerBookings',
  async (thunkAPI) => {
    try {
      return await bookingService.getOwnerBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllBookings = createAsyncThunk(
  'booking/getAllBookings',
  async (thunkAPI) => {
    try {
      return await bookingService.getAllBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllBookingsByOwner = createAsyncThunk(
  'booking/getAllBookingsByOwner',
  async (ownerId, thunkAPI) => {
    try {
      return await bookingService.getAllBookingsByOwner(ownerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllCompletedBookings = createAsyncThunk(
  'booking/getAllCompletedBookings',
  async (ownerId, thunkAPI) => {
    try {
      return await bookingService.getAllCompletedBookings(ownerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllActiveBookings = createAsyncThunk(
  'booking/getAllActiveBookings',
  async (ownerId, thunkAPI) => {
    try {
      return await bookingService.getAllActiveBookings(ownerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPendingBookings = createAsyncThunk(
  'booking/getAllPendingBookings',
  async (ownerId, thunkAPI) => {
    try {
      return await bookingService.getAllPendingBookings(ownerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPaidBookings = createAsyncThunk(
  'booking/getAllPaidBookings',
  async (ownerId, thunkAPI) => {
    try {
      return await bookingService.getAllPaidBookings(ownerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllCanceledBookings = createAsyncThunk(
  'booking/getAllCanceledBookings',
  async (ownerId, thunkAPI) => {
    try {
      return await bookingService.getAllCanceledBookings(ownerId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createYandexPay = createAsyncThunk(
  'bookings/createYandexPay',
  async (userData, thunkAPI) => {
    try {
      return await bookingService.createYandexPay(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const bookingState = {
  booking: '',
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  //======={New}==========================
  isLoggedIn: false,
  city: '',
  type: '',
  roomType: '',
  roomNumber: '',
  checkIn: null,
  checkOut: null,
  // guestNumber: 1,
  guestNumber: null,
  guestName: null,
  guestPhone: null,
  isPaymentCompleted: false,
  ownerId: '',
};
export const bookingSlice = createSlice({
  name: 'booking',
  initialState: bookingState,
  reducers: {
    setType(state, action) {
      state.type = action.payload;
    },
    setRoomType(state, action) {
      state.roomType = action.payload;
    },
    setRoomNumber(state, action) {
      state.roomNumber = action.payload;
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
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedUserBookings = action.payload;
        // state.message = "booking Fetched sucessfully!";
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateOwnerBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOwnerBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedOwnerBooking = action.payload;
      })
      .addCase(updateOwnerBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'booking Updated sucessfully!';
        state.message = action.error;
      })
      .addCase(getOneUserBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneUserBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedOneUserBooking = action.payload;
      })
      .addCase(getOneUserBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllBookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllBookingsByOwner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBookingsByOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllBookingsByOwner = action.payload;
      })
      .addCase(getAllBookingsByOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllCompletedBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCompletedBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllCompletedBookings = action.payload;
      })
      .addCase(getAllCompletedBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllActiveBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllActiveBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllActiveBookings = action.payload;
      })
      .addCase(getAllActiveBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllPendingBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPendingBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllPendingBookings = action.payload;
      })
      .addCase(getAllPendingBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(getAllPaidBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPaidBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllPaidBookings = action.payload;
      })
      .addCase(getAllPaidBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(getAllCanceledBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCanceledBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllCanceledBookings = action.payload;
      })
      .addCase(getAllCanceledBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createYandexPay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createYandexPay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createYandexPay = action.payload;
      })
      .addCase(createYandexPay.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
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
  setRoomType,
  setRoomNumber,
} = bookingSlice.actions;

export const selectType = (state) => state.booking.type;
export const selectCity = (state) => state.booking.city;
export const selectCheckIn = (state) => state.booking.checkIn;
export const selectCheckOut = (state) => state.booking.checkOut;
export const selectGuestNumber = (state) => state.booking.guestNumber;
export const selectGuestName = (state) => state.booking.guestName;
export const selectGuestPhone = (state) => state.booking.guestPhone;
export const selectIsPaymentCompleted = (state) =>
  state.booking.isPaymentCompleted;
export const selectOwnerId = (state) => state.booking.ownerId;

export default bookingSlice.reducer;
