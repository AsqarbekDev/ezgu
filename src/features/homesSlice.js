import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const homesSlice = createSlice({
  name: "homes",
  initialState,
  reducers: {
    setHomes: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setHomes } = homesSlice.actions;

export const selectHomes = (state) => state.homes.value;

export default homesSlice.reducer;
