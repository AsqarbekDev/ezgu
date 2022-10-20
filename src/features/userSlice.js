import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  waiting: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = null;
    },
    setWaiting: (state, action) => {
      state.waiting = action.payload;
    },
  },
});

export const { login, logout, setWaiting } = userSlice.actions;

export const selectUser = (state) => state.user.value;
export const selectWaiting = (state) => state.user.waiting;

export default userSlice.reducer;
