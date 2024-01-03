import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import placeService from './placeService';

export const createPlace = createAsyncThunk(
  'places/create',
  async (userData, thunkAPI) => {
    try {
      return await placeService.createPlace(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserPlaces = createAsyncThunk(
  'places/getUserPlaces',
  async (thunkAPI) => {
    try {
      return await placeService.getUserPlaces();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOnePlace = createAsyncThunk(
  'place/getOnePlace',
  async (id, thunkAPI) => {
    try {
      return await placeService.getOnePlace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePlaces = createAsyncThunk(
  'place/getAPlace',
  async (userData, thunkAPI) => {
    try {
      return await placeService.updatePlaces(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPlaceRooms = createAsyncThunk(
  'place/getPlaceRooms',
  async (id, thunkAPI) => {
    try {
      return await placeService.getPlaceRooms(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePlace = createAsyncThunk(
  'place/updatePlace',
  async (id, thunkAPI) => {
    try {
      return await placeService.updatePlace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deletePlace = createAsyncThunk(
  'place/deletePlace',
  async (id, thunkAPI) => {
    try {
      return await placeService.deletePlace(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const countByCity = createAsyncThunk(
  'place/countByCity',
  async (thunkAPI) => {
    try {
      return await placeService.countByCity();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const countByType = createAsyncThunk(
  'place/countByType',
  async (thunkAPI) => {
    try {
      return await placeService.countByType();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPlaces = createAsyncThunk(
  'place/getAllPlaces',
  async (thunkAPI) => {
    try {
      return await placeService.getAllPlaces();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPlacesByCityAndType = createAsyncThunk(
  'place/getAllPlacesByCityAndType',
  async (city, type, thunkAPI) => {
    try {
      return await placeService.getAllPlacesByCityAndType(city, type);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'place/addToWishlist',
  async (id, thunkAPI) => {
    try {
      return await placeService.addToWishlist(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const rating = createAsyncThunk(
  'places/rating',
  async (userData, thunkAPI) => {
    try {
      return await placeService.rating(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createRoom = createAsyncThunk(
  'places/createRoom',
  async (userData, thunkAPI) => {
    try {
      return await placeService.createRoom(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateRoomAvailability = createAsyncThunk(
  'places/updateRoomAvailability',
  async (id, thunkAPI) => {
    try {
      return await placeService.updateRoomAvailability(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateRoom = createAsyncThunk(
  'places/updateRoom',
  async (userData, thunkAPI) => {
    try {
      return await placeService.updateRoom(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'places/deleteRoom',
  async (id, placeId, thunkAPI) => {
    try {
      return await placeService.deleteRoom(id, placeId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOneRoom = createAsyncThunk(
  'places/getOneRoom',
  async (userData, thunkAPI) => {
    try {
      return await placeService.getOneRoom(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAllRooms = createAsyncThunk(
  'places/rooms/getAllRooms',
  async (userData, thunkAPI) => {
    try {
      return await placeService.getAllRooms(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserRooms = createAsyncThunk(
  'places/getUserRooms',
  async (placeId, thunkAPI) => {
    try {
      return await placeService.getUserRooms(placeId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllAvailableRooms = createAsyncThunk(
  'places/getAllAvailableRooms',
  async (thunkAPI) => {
    try {
      return await placeService.getAllAvailableRooms();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllAvailableRoomsByCityAndType = createAsyncThunk(
  'places/getAllAvailableRoomsByCityAndType',
  async (city, type, thunkAPI) => {
    try {
      return await placeService.getAllAvailableRoomsByCityAndType(city, type);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const placeState = {
  place: '',
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  //========={New}========================
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
export const placeSlice = createSlice({
  name: 'place',
  initialState: placeState,
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
    updatePaymentOptions(state, action) {
      state.paymentOptions = action.payload;
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
  extraReducers: (builder) => {
    builder
      .addCase(createPlace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createPlace = action.payload;
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getUserPlaces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPlaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedUserPlaces = action.payload;
        // state.message = "place Fetched sucessfully!";
      })
      .addCase(getUserPlaces.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOnePlace.pending, (state) => {})
      .addCase(getOnePlace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedOneUserplace = action.payload;
      })
      .addCase(getOnePlace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updatePlaces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePlaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedOwnerplace = action.payload;
      })
      .addCase(updatePlaces.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'place Updated sucessfully!';
        state.message = action.error;
      })
      .addCase(getPlaceRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlaceRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedPlaceRooms = action.payload;
      })
      .addCase(getPlaceRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'place Updated sucessfully!';
        state.message = action.error;
      })
      .addCase(updatePlace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedPlace = action.payload;
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deletePlace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedPlace = action.payload;
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(countByCity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(countByCity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.countedByCity = action.payload;
      })
      .addCase(countByCity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(countByType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(countByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.countedByType = action.payload;
      })
      .addCase(countByType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllPlaces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPlaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllPlaces = action.payload;
      })
      .addCase(getAllPlaces.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllPlacesByCityAndType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPlacesByCityAndType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllPlacesByCityAndType = action.payload;
      })
      .addCase(getAllPlacesByCityAndType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.addedToWishlist = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(rating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.rated = action.payload;
      })
      .addCase(rating.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdRoom = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateRoomAvailability.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoomAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedRoomAvailability = action.payload;
      })
      .addCase(updateRoomAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedRoom = action.payload;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedRoom = action.payload;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOneRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedOneRoom = action.payload;
      })
      .addCase(getOneRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllRooms = action.payload;
      })
      .addCase(getAllRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getUserRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedUserRooms = action.payload;
      })
      .addCase(getUserRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllAvailableRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAvailableRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllAvailableRooms = action.payload;
      })
      .addCase(getAllAvailableRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAllAvailableRoomsByCityAndType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAvailableRoomsByCityAndType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.fetchedAllAvailableRoomsByCityAndType = action.payload;
      })
      .addCase(getAllAvailableRoomsByCityAndType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      });
  },
});

export const {
  updateType,
  updateTitle,
  updateCity,
  updateAddress,
  updateDescription,
  updatePaymentOptions,
  updateCheckIn,
  updateCheckOut,
  updateExtraInfo,
  updatePlaceId,
  updatePerks,
  updateRating,
} = placeSlice.actions;

export default placeSlice.reducer;
