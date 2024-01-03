import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const getUserfromLocalStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  // user: getUserfromLocalStorage,
  user: JSON.parse(window?.localStorage.getItem('user')) ?? {},
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

//======{facebook}==============================
export const loginFacebook = createAsyncThunk(
  'auth/loginFacebook',
  async (thunkAPI) => {
    try {
      return await authService.loginFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginCallbackFacebook = createAsyncThunk(
  'auth/loginCallbackFacebook',
  async (thunkAPI) => {
    try {
      return await authService.loginCallbackFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const loginSuccessFacebook = createAsyncThunk(
  'auth/loginSuccessFacebook',
  async (thunkAPI) => {
    try {
      return await authService.loginSuccessFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginErrorFacebook = createAsyncThunk(
  'auth/loginErrorFacebook',
  async (thunkAPI) => {
    try {
      return await authService.loginErrorFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const registerFacebook = createAsyncThunk(
  'auth/registerFacebook',
  async (thunkAPI) => {
    try {
      return await authService.registerFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const registerCallbackFacebook = createAsyncThunk(
  'auth/registerCallbackFacebook',
  async (thunkAPI) => {
    try {
      return await authService.registerCallbackFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerSuccessFacebook = createAsyncThunk(
  'auth/registerSuccessFacebook',
  async (thunkAPI) => {
    try {
      return await authService.registerSuccessFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerErrorFacebook = createAsyncThunk(
  'auth/registerErrorFacebook',
  async (thunkAPI) => {
    try {
      return await authService.registerErrorFacebook();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//==============={google}==============================
export const loginGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (thunkAPI) => {
    try {
      return await authService.loginGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginCallbackGoogle = createAsyncThunk(
  'auth/loginCallbackGoogle',
  async (thunkAPI) => {
    try {
      return await authService.loginCallbackGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const loginSuccessGoogle = createAsyncThunk(
  'auth/loginSuccessGoogle',
  async (thunkAPI) => {
    try {
      return await authService.loginSuccessGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginErrorGoogle = createAsyncThunk(
  'auth/loginErrorGoogle',
  async (thunkAPI) => {
    try {
      return await authService.loginErrorGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const registerGoogle = createAsyncThunk(
  'auth/registerGoogle',
  async (thunkAPI) => {
    try {
      return await authService.registerGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const registerCallbackGoogle = createAsyncThunk(
  'auth/registerCallbackGoogle',
  async (thunkAPI) => {
    try {
      return await authService.registerCallbackGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerSuccessGoogle = createAsyncThunk(
  'auth/registerSuccessGoogle',
  async (thunkAPI) => {
    try {
      return await authService.registerSuccessGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerErrorGoogle = createAsyncThunk(
  'auth/registerErrorGoogle',
  async (thunkAPI) => {
    try {
      return await authService.registerErrorGoogle();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//================={local}=================

export const loginLocal = createAsyncThunk(
  'auth/loginLocal',
  async (userData, thunkAPI) => {
    try {
      return await authService.loginLocal(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const registerLocal = createAsyncThunk(
  'auth/registerLocal',
  async (userData, thunkAPI) => {
    try {
      return await authService.registerLocal(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const loginSuccessLocal = createAsyncThunk(
  'auth/loginSuccessLocal',
  async (thunkAPI) => {
    try {
      return await authService.loginSuccessLocal();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginErrorLocal = createAsyncThunk(
  'auth/loginErrorLocal',
  async (thunkAPI) => {
    try {
      return await authService.loginErrorLocal();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//======{facebook}==============================
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginCallbackFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginCallbackFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginCallbackFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginSuccessFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginSuccessFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // user data
        state.message = 'success';
      })
      .addCase(loginSuccessFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginErrorFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginErrorFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginErrorFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(registerFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerCallbackFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCallbackFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(registerCallbackFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerSuccessFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSuccessFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // user Data
        state.message = 'success';
      })
      .addCase(registerSuccessFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerErrorFacebook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerErrorFacebook.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = 'success';
      })
      .addCase(registerErrorFacebook.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginCallbackGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginCallbackGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginCallbackGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(loginSuccessGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginSuccessGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // expected user data
        state.message = 'success';
      })
      .addCase(loginSuccessGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginErrorGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginErrorGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginErrorGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(registerGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerCallbackGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCallbackGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(registerCallbackGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerSuccessGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSuccessGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // expected userData
        state.message = 'success';
      })
      .addCase(registerSuccessGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerErrorGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerErrorGoogle.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(registerErrorGoogle.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginLocal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginLocal.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginLocal.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(registerLocal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerLocal.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = 'success';
      })
      .addCase(registerLocal.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginSuccessLocal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginSuccessLocal.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // expected user data
        state.message = 'success';
      })
      .addCase(loginSuccessLocal.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(loginErrorLocal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginErrorLocal.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
        // state.message = 'success';
        state.message = action.success;
      })
      .addCase(loginErrorLocal.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;

export function Login(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login({ user }));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}
