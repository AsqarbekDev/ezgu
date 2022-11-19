import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "../features/jobsSlice";
import userReducer from "../features/userSlice";
import homesReducer from "../features/homesSlice";
import chatsReducer from "../features/chatsSlice";
import notificationsReducer from "../features/notificationsSlice";
import themeReducer from "../features/themeSlice";
import languageReducer from "../features/languageSlice";
import disableScrollReducer from "../features/disableScrollSlice";
import shareReducer from "../features/shareSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    user: userReducer,
    homes: homesReducer,
    chats: chatsReducer,
    notifications: notificationsReducer,
    theme: themeReducer,
    language: languageReducer,
    disableScroll: disableScrollReducer,
    share: shareReducer,
  },
});
