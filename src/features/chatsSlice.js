import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
  chatRooms: null,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChatRooms: (state, action) => {
      state.chatRooms = action.payload;
      action.payload.map((chatRoom) => {
        return (state.value[chatRoom.id] = { messagingUser: {}, messages: [] });
      });
    },
    setMessagingUsers: (state, action) => {
      state.value[action.payload.id].messagingUser =
        action.payload.messagingUser;
    },
    setChats: (state, action) => {
      state.value[action.payload.id].messages = action.payload.messages;
    },
  },
});

export const { setChatRooms, setMessagingUsers, setChats } = chatsSlice.actions;

export const selectChatRooms = (state) => state.chats.chatRooms;
export const selectMessagingUsers = (state) => state.chats.messagingUsers;
export const selectChats = (state) => state.chats.value;

export default chatsSlice.reducer;
