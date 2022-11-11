import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
  chatRooms: null,
  deletingChat: null,
  checkingChat: null,
  waiting: true,
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
            deleted: chatRoom.deleted,
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
    deleteChat: (state, action) => {
      state.deletingChat = action.payload;
    },
    checkChat: (state, action) => {
      state.checkingChat = action.payload;
    },
    setWaitingChat: (state, action) => {
      state.waiting = action.payload;
    },
  },
});

export const {
  setChatRooms,
  setMessagingUsers,
  setChats,
  deleteChat,
  checkChat,
  setWaitingChat,
} = chatsSlice.actions;

export const selectChatRooms = (state) => state.chats.chatRooms;
export const selectMessagingUsers = (state) => state.chats.messagingUsers;
export const selectChats = (state) => state.chats.value;
export const selectDeletingChat = (state) => state.chats.deletingChat;
export const selectCheckingChat = (state) => state.chats.checkingChat;
export const selectWaitingChat = (state) => state.chats.waiting;

export default chatsSlice.reducer;
