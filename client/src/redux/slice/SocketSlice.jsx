/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attempt: 0,
};
const SocketSlice = createSlice({
  name: "SocketSlice",
  initialState,
  reducers: {
    incSocketAttempt: (state) => {
      return { ...state, attempt: state.attempt + 1 };
    },
    resetSocket: (state) => {
      return { ...state, attempt: 0 };
    },
  },
});

export const { incSocketAttempt, resetSocket } = SocketSlice.actions;

export const SocketReducer = SocketSlice.reducer;

export const socketState = (state) => state.socket;
