import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const disableScrollSlice = createSlice({
  name: "disableScroll",
  initialState,
  reducers: {
    setDisableScroll: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setDisableScroll } = disableScrollSlice.actions;

export const selectDisableScroll = (state) => state.disableScroll.value;

export default disableScrollSlice.reducer;
