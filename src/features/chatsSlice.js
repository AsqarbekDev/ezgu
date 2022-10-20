import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
  chatRooms: null,
  messagingUsers: {},
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChatRooms: (state, action) => {
      state.chatRooms = action.payload;
    },
    setMessagingUsers: (state, action) => {
      state.messagingUsers[action.payload.id] = action.payload.messagingUser;
    },
    setChats: (state, action) => {
      state.value[action.payload.id] = action.payload;
    },
  },
});

export const { setChatRooms, setMessagingUsers, setChats } = chatsSlice.actions;

export const selectChatRooms = (state) => state.chats.chatRooms;
export const selectMessagingUsers = (state) => state.chats.messagingUsers;
export const selectChats = (state) => state.chats.value;

export default chatsSlice.reducer;
