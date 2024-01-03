import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window?.localStorage.getItem('user')) ?? {},
};

// const initialState = {
//   user: JSON.parse(window?.localStorage.getItem("userInfo")) ?? users[1],
// };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem('user');
      localStorage.clear(); // clear local storage completely
    },
  },
});

export default userSlice.reducer;

export function LoginUser(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login({ user }));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}
