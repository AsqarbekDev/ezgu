import { createSlice } from "@reduxjs/toolkit";
import { dark, light } from "./sliceData/theme";

const initialState = {
  light: light,
  dark: dark,
  currentTheme: light,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      if (action.payload === "light") {
        state.currentTheme = state.light;
      } else if (action.payload === "dark") {
        state.currentTheme = state.dark;
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.currentTheme;

export default themeSlice.reducer;
