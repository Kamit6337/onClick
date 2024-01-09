/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteChat: {
    bool: false,
    data: null,
  },
};

const MutationSlice = createSlice({
  name: "MutationSlice",
  initialState,
  reducers: {
    deleteChatReducer: (state, { payload }) => {
      const { bool, data } = payload;

      return { ...state, deleteChat: { bool, data } };
    },
  },
});

export const { deleteChatReducer } = MutationSlice.actions;

export const MutationReducer = MutationSlice.reducer;

export const mutationState = (state) => state.mutation;
