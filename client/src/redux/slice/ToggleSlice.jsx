/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupChatForm: false,
  updateGroupChat: false,
  showChatOptions: {
    bool: false,
    data: null,
  },
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
    toggleChatOptionOnRightClick: (state, { payload }) => {
      const { bool, data } = payload;

      return { ...state, showChatOptions: { data, bool } };
    },
  },
});

export const {
  toggleGroupChatForm,
  toggleUpdateGroupChatForm,
  toggleChatOptionOnRightClick,
} = ToggleSlice.actions;

export const ToggleReducer = ToggleSlice.reducer;

export const toggleInitialState = (state) => state.toggle;
