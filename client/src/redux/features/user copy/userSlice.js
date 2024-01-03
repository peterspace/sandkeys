import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from './userService';
import { toast } from 'react-toastify';

// const name = JSON.parse(localStorage.getItem('name'));
const name = localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')) : null;
const userLocal = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user: userLocal,
  //   orders: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  //========={New}===============
  // isLoggedIn: false,
  // name: name ? name : '', 
  // userId: '',
  // role: '',
  // email: '',

  isLoggedIn: false,
  name: userLocal ? userLocal?.name : '',
  userId: userLocal ? userLocal?._id : '',
  role: userLocal ? userLocal?.role : '',
  email: userLocal ? userLocal?.email : '',
};
export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (userData, thunkAPI) => {
    try {
      return await userService.loginUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (userData, thunkAPI) => {
    try {
      return await userService.registerUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Not in use currently
export const logoutUser = createAsyncThunk(
  'users/logoutUser',
  async (thunkAPI) => {
    try {
      return await userService.logoutUser();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserWishlist = createAsyncThunk(
  'user/wishlist',
  async (thunkAPI) => {
    try {
      return await userService.getUserWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addToCart = createAsyncThunk(
  'user/cart/add',
  async (cartData, thunkAPI) => {
    try {
      return await userService.addToCart(cartData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCart = createAsyncThunk('user/getCart', async (thunkAPI) => {
  try {
    return await userService.getCart();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const removeRoomFromCart = createAsyncThunk(
  'user/removeRoomFromCart',
  async (cartItemId, thunkAPI) => {
    try {
      return await userService.removeRoomFromCart(cartItemId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCartRoom = createAsyncThunk(
  'user/cart/room/update',
  async (cartDetail, thunkAPI) => {
    try {
      return await userService.updateCartRoom(cartDetail);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  'users/order/get-orders',
  async (thunkAPI) => {
    try {
      return await userService.getOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getOrderByUser = createAsyncThunk(
  'users/order/get-order',
  async (id, thunkAPI) => {
    try {
      return await userService.getOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//==========={new}===================================================

export const emptyCart = createAsyncThunk(
  'users/emptyCart',
  async (userData, thunkAPI) => {
    try {
      return await userService.emptyCart(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'users/forgotPassword',
  async (userData, thunkAPI) => {
    try {
      return await userService.forgotPassword(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'users/resetPassword',
  async (userData, resetToken, thunkAPI) => {
    try {
      return await userService.resetPassword(userData, resetToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const changePassword = createAsyncThunk(
  'users/changePassword',
  async (userData, thunkAPI) => {
    try {
      return await userService.changePassword(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'users/updatePassword',
  async (userData, thunkAPI) => {
    try {
      return await userService.updatePassword(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'users/applyCoupon',
  async (userData, thunkAPI) => {
    try {
      return await userService.applyCoupon(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createOrder = createAsyncThunk(
  'users/order/createOrder',
  async (userData, thunkAPI) => {
    try {
      return await userService.createOrder(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'users/order/getUserOrders',
  async (id, thunkAPI) => {
    try {
      return await userService.getUserOrders(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserOders = createAsyncThunk(
  'users/order/getUserOders',
  async (thunkAPI) => {
    try {
      return await userService.getUserOders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk('users/getUser', async (thunkAPI) => {
  try {
    return await userService.getUser();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData, thunkAPI) => {
    try {
      return await userService.updateUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const saveAddress = createAsyncThunk(
  'users/saveAddress',
  async (userData, thunkAPI) => {
    try {
      return await userService.saveAddress(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getLoginStatus = createAsyncThunk(
  'users/getLoginStatus',
  async (thunkAPI) => {
    try {
      return await userService.getLoginStatus();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerAgent = createAsyncThunk(
  'users/registerAgent',
  async (userData, thunkAPI) => {
    try {
      return await userService.registerAgent(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerAdmin = createAsyncThunk(
  'users/registerAdmin',
  async (userData, thunkAPI) => {
    try {
      return await userService.registerAdmin(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (thunkAPI) => {
    try {
      return await userService.getAllUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllAgents = createAsyncThunk(
  'users/getAllAgents',
  async (thunkAPI) => {
    try {
      return await userService.getAllAgents();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllAdmins = createAsyncThunk(
  'users/getAllAdmins',
  async (thunkAPI) => {
    try {
      return await userService.getAllAdmins();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//=========================================

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem('customer', JSON.stringify(action.payload));
        state.message = 'success';
        if (state.isSuccess === true) {
          toast.info('User logged in sucessfully');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
        if (state.isError === true) {
          toast.error(action.error);
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.createdUser = action.payload;
        state.message = 'success';
        if (state.isSuccess === true) {
          toast.info('User Created Sucessfully');
        }
        // state.message = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
        if (state.isError === true) {
          toast.error(action.error);
        }
      })

      .addCase(getUserWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.fetchedUserWishlist = action.payload;
        state.message = 'success';
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.addedToCart = action.payload;
        if (state.isSuccess) {
          toast.success('Room added to cart');
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.fetchedCart = action.payload;
        if (state.isSuccess) {
          toast.success('Room added to cart');
        }
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(removeRoomFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeRoomFromCart.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.removedRoomFromCart = action.payload;
        if (state.isSuccess) {
          toast.success('Room added to cart');
        }
      })
      .addCase(removeRoomFromCart.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(updateCartRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartRoom.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.updatedCartRoom = action.payload;
        if (state.isSuccess === true) {
          toast.success('Cart items updated sucessfully!');
        }
      })
      .addCase(updateCartRoom.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
        if (state.isSuccess === false) {
          toast.error('Something went wrong!');
        }
      })

      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.fetchedOrders = action.payload;
        state.message = 'success';
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getOrderByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.fetchedOrderbyuser = action.payload;
        state.message = 'success';
      })
      .addCase(getOrderByUser.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      });
  },
});

export const { SetLogin, SetName, SetUserId, SetRole, SetEmail, SetInitialState } =
  userSlice.actions;

export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectName = (state) => state.user.name;
// export const selectUserId = (state) => state.user.user.userId;
export const selectUserId = (state) => state.user.userId;
export const selectRole = (state) => state.user.role;

export default userSlice.reducer;
