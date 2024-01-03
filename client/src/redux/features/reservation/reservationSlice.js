import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reservationService from './reservationService';

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (userData, thunkAPI) => {
    try {
      return await reservationService.createReservation(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserReservations = createAsyncThunk(
  'reservations/getUserReservations',
  async (thunkAPI) => {
    try {
      return await reservationService.getUserReservations();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOneUserReservation = createAsyncThunk(
  'reservation/getOneUserReservation',
  async (id, thunkAPI) => {
    try {
      return await reservationService.getOneUserReservation(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOwnerReservations = createAsyncThunk(
  'reservation/getOwnerReservations',
  async (thunkAPI) => {
    try {
      return await reservationService.getOwnerReservations();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOneOwnerReservation = createAsyncThunk(
  'reservation/getOneOwnerReservation',
  async (id, thunkAPI) => {
    try {
      return await reservationService.getOneOwnerReservation(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getReservationsApproval = createAsyncThunk(
  'reservations/getReservationsApproval',
  async (userData, thunkAPI) => {
    try {
      return await reservationService.getReservationsApproval(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOneUserReservationInternal = createAsyncThunk(
  'reservations/getOneUserReservationInternal',
  async (userData, thunkAPI) => {
    try {
      return await reservationService.getOneUserReservationInternal(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const reservationNotificationOwner = createAsyncThunk(
  'reservations/reservationNotificationOwner',
  async (userData, thunkAPI) => {
    try {
      return await reservationService.reservationNotificationOwner(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const reservationState = {
  reservation: '',
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};
export const reservationSlice = createSlice({
  name: 'reservation',
  initialState: reservationState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createReservation = action.payload;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getUserReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedUserReservations = action.payload;
        // state.message = "reservation Fetched sucessfully!";
      })
      .addCase(getUserReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOneUserReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneUserReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedOneUserReservation = action.payload;
      })
      .addCase(getOneUserReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOwnerReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOwnerReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedOwnerReservations = action.payload;
      })
      .addCase(getOwnerReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOneOwnerReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneOwnerReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedOneOwnerReservation = action.payload;
      })
      .addCase(getOneOwnerReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getReservationsApproval.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReservationsApproval.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getReservationsApproval = action.payload;
      })
      .addCase(getReservationsApproval.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOneUserReservationInternal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneUserReservationInternal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getOneUserReservationInternal = action.payload;
      })
      .addCase(getOneUserReservationInternal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(reservationNotificationOwner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reservationNotificationOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.reservationNotificationOwner = action.payload;
      })
      .addCase(reservationNotificationOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export default reservationSlice.reducer;
