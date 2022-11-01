import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  light: {
    type: "light",
    appBackground: "#fafafa",
    backgroundBody: "#fafafa",
    background: "#FFF",
    textColor: "#000",
    iconColor: "#4a4847",
    border: "#000",
    buttonOpacityColor: "#d6d5d4",
    addScreenMoreCom: "#E5E7EB",
    borderBlack: "#d6d5d4",
    chatTimeColor: "#4B5563",
    sidebarBtnBackground: "#D1D5DB",
  },
  dark: {
    type: "dark",
    appBackground: "#090909",
    backgroundBody: "#0f0f0f",
    background: "#000",
    textColor: "#FFF",
    iconColor: "#FFF",
    border: "#FFF",
    buttonOpacityColor: "#212020",
    addScreenMoreCom: "#212020",
    borderBlack: "#212020",
    chatTimeColor: "#e6e6e6",
    sidebarBtnBackground: "#333332",
  },
  currentTheme: {
    type: "light",
    appBackground: "#fafafa",
    backgroundBody: "#fafafa",
    background: "#FFF",
    textColor: "#000",
    iconColor: "#4a4847",
    border: "#000",
    buttonOpacityColor: "#d6d5d4",
    addScreenMoreCom: "#E5E7EB",
    borderBlack: "#d6d5d4",
    chatTimeColor: "#4B5563",
    sidebarBtnBackground: "#D1D5DB",
  },
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
