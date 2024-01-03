/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupChatForm: false,
  updateGroupChat: false,
};

const ToggleSlice = createSlice({
  name: "ToggleSlice",
  initialState,
  reducers: {
    toggleGroupChatForm: (state, { payload }) => {
      return { ...state, groupChatForm: payload };
    },
    toggleUpdateGroupChatForm: (state, { payload }) => {

        
      return { ...state, updateGroupChat: payload };
    },
  },
});

export const { toggleGroupChatForm, toggleUpdateGroupChatForm } =
  ToggleSlice.actions;

export const ToggleReducer = ToggleSlice.reducer;

export const toggleInitialState = (state) => state.toggle;
