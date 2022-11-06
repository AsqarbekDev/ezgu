import { createSlice } from "@reduxjs/toolkit";
import { eng, ru, uz } from "./sliceData/language";

const initialState = {
  eng: eng,
  ru: ru,
  uz: uz,
  currentLanguage: uz,
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      if (action.payload === "eng") {
        state.currentLanguage = state.eng;
      } else if (action.payload === "ru") {
        state.currentLanguage = state.ru;
      } else if (action.payload === "uz") {
        state.currentLanguage = state.uz;
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const selectLanguage = (state) => state.language.currentLanguage;

export default languageSlice.reducer;
