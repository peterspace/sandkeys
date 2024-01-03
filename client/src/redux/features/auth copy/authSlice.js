import { createSlice } from '@reduxjs/toolkit';

const name = JSON.parse(localStorage.getItem('name'));

const initialState = {
  isLoggedIn: false,
  name: name ? name : '',
  userId: '',
  role: '',
  email: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SetLogin(state, action) {
      state.isLoggedIn = action.payload;
    },
    SetName(state, action) {
      localStorage.setItem('name', JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SetUserId(state, action) {
      state.userId = action.payload;
    },
    SetEmail(state, action) {
      state.email = action.payload;
    },
    SetRole(state, action) {
      state.role = action.payload;
    },
    SetInitialState(state, action) {
      state = initialState;
    },
  },
});

export const { SetLogin, SetName, SetUserId, SetRole, SetEmail, SetInitialState } =
  authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
// export const selectUserId = (state) => state.auth.user.userId;
export const selectUserId = (state) => state.auth.userId;
export const selectRole = (state) => state.auth.role;

export default authSlice.reducer;
