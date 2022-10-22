import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.value;

export default notificationsSlice.reducer;
