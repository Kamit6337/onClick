import { configureStore } from "@reduxjs/toolkit";
import { RoomReducer } from "./slice/roomSlice";
import { ToggleReducer } from "./slice/toggleSlice";

export const store = configureStore({
  reducer: {
    rooms: RoomReducer,
    toggle: ToggleReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false, // Disable strict mode
  //   }),
});
