import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  peer: null,
  chatId: null,
  messages: [],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startChat: (state) => {
      state.loading = true;
      state.error = null;
      state.isConnected = false;
      state.peer = null;
      state.chatId = null;
      state.messages = [];
    },
    chatConnected: (state, action) => {
      state.isConnected = true;
      state.peer = action.payload.peer;
      state.chatId = action.payload.chatId;
      state.loading = false;
    },
    chatDisconnected: (state) => {
      state.isConnected = false;
      state.peer = null;
      state.chatId = null;
      state.messages = [];
    },
    addMessage: (state, action) => {
      const message = {
        ...action.payload,
        timestamp: new Date(action.payload.timestamp).toISOString(),
      };
      state.messages.push(message);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChat: (state) => {
      state.messages = [];
      state.isConnected = false;
      state.peer = null;
      state.chatId = null;
    },
  },
});

// Action creators
export const {
  startChat,
  chatConnected,
  chatDisconnected,
  addMessage,
  setError,
  clearChat,
} = chatSlice.actions;

// Selectors
export const selectChat = (state) => state.chat;
export const selectIsConnected = (state) => state.chat.isConnected;
export const selectMessages = (state) => state.chat.messages;
export const selectLoading = (state) => state.chat.loading;
export const selectError = (state) => state.chat.error;

export default chatSlice.reducer;
