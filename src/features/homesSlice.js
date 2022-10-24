import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  myAddedHomes: [],
};

export const homesSlice = createSlice({
  name: "homes",
  initialState,
  reducers: {
    setHomes: (state, action) => {
      state.value = action.payload;
    },
    setMyAddedHomes: (state, action) => {
      state.myAddedHomes = action.payload;
    },
  },
});

export const { setHomes, setMyAddedHomes } = homesSlice.actions;

export const selectHomes = (state) => state.homes.value;
export const selectMyAddedHomes = (state) => state.homes.myAddedHomes;

export default homesSlice.reducer;
