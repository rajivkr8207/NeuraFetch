import { createSlice, } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    loading: false,
    error: null,
    messages: []
  },
  reducers: {
    addItems: (state, action) => {
      state.items = action.payload;
    },
    removeItems: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    setMessages: (state, action) => {
      state.messages = action.payload; // replace all
    },

    
  },
});

export const { addItems, setLoading, setError,addMessage,setMessages,removeItems } = itemSlice.actions;

export default itemSlice.reducer;