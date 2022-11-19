import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const shareSlice = createSlice({
  name: "share",
  initialState,
  reducers: {
    setShare: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setShare } = shareSlice.actions;

export const selectShare = (state) => state.share.value;

export default shareSlice.reducer;
