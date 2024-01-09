/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeRoom: null,
  rooms: [],
};

const RoomSlice = createSlice({
  name: "RoomSlice",
  initialState,
  reducers: {
    setActiveRoom: (state, { payload }) => {
      return {
        ...state,
        activeRoom: payload,
      };
    },

    setRooms: (state, { payload }) => {
      return { ...state, rooms: payload };
    },

    updateRooms: (state, { payload }) => {
      const { room } = payload;

      // Modify the draft in place
      state.rooms = state.rooms.map((obj) => {
        if (obj._id === room) {
          obj.chats.push(payload);
        }
        return obj;
      });
      return state; // Return the updated state
    },
    deleteChatUpdateRoom: (state, { payload }) => {
      const chatId = payload;

      state.rooms = state.rooms.map((room) => {
        if (room._id === state.activeRoom) {
          room.chats = room.chats.filter((chat) => chat._id !== chatId);
        }

        return room;
      });

      return state;
    },
    resetActiveRoom: (state) => {
      return { ...state, activeRoom: null };
    },
    // extraReducer: (state) => state,
  },
});

export const {
  setActiveRoom,
  setRooms,
  updateRooms,
  deleteChatUpdateRoom,
  resetActiveRoom,
} = RoomSlice.actions;

export const RoomReducer = RoomSlice.reducer;

export const roomsState = (state) => state.rooms;
