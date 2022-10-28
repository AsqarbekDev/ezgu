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
      if (action.payload.length > 0) {
        action.payload.map((chatRoom) => {
          return (state.value[chatRoom.id] = {
            messagingUser: {},
            messages: [],
          });
        });
      } else {
        state.value = {};
      }
    },
    setMessagingUsers: (state, action) => {
      if (state.value[action.payload.id]) {
        state.value[action.payload.id].messagingUser =
          action.payload.messagingUser;
      }
    },
    setChats: (state, action) => {
      if (
        state.value[action.payload.id] &&
        action.payload.messages.length > 0
      ) {
        state.value[action.payload.id].messages = action.payload.messages;
      }
    },
  },
});

export const { setChatRooms, setMessagingUsers, setChats } = chatsSlice.actions;

export const selectChatRooms = (state) => state.chats.chatRooms;
export const selectMessagingUsers = (state) => state.chats.messagingUsers;
export const selectChats = (state) => state.chats.value;

export default chatsSlice.reducer;
