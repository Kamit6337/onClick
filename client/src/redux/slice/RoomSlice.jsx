/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeRoom: null,
  rooms: [],
  activeRoomChats: [],
  activeRoomDetail: null,
};

const RoomSlice = createSlice({
  name: "RoomSlice",
  initialState,
  reducers: {
    setActiveRoom: (state, { payload }) => {
      if (payload) {
        const findRoom = state.rooms?.find((obj) => obj.id === payload);

        return {
          ...state,
          activeRoom: payload,
          activeRoomChats: findRoom.chats,
          activeRoomDetail: findRoom,
        };
      }
    },
    setRooms: (state, { payload }) => {
      if (payload) {
        return { ...state, rooms: payload };
      }
    },
    updateRooms: (state, { payload }) => {
      const { room } = payload;

      let updatedState = { ...state }; // Create a copy of the state

      if (room === state.activeRoom) {
        // Update activeRoomChats
        updatedState.activeRoomChats = [...state.activeRoomChats, payload];
      }

      // Update rooms
      updatedState.rooms = state.rooms.map((obj) => {
        if (obj.id === room) {
          return {
            ...obj,
            chats: [...obj.chats, payload],
          };
        }
        return obj;
      });

      return updatedState; // Return the updated state
    },
    extraReducer: (state) => state,
  },
});

export const { setActiveRoom, setRooms, updateRooms } = RoomSlice.actions;

export const RoomReducer = RoomSlice.reducer;

export const roomsState = (state) => state.rooms;
