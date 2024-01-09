import { configureStore } from "@reduxjs/toolkit";
import { RoomReducer } from "./slice/roomSlice";
import { ToggleReducer } from "./slice/toggleSlice";
import { MutationReducer } from "./slice/mutationSlice";
import { SocketReducer } from "./slice/SocketSlice";

export const store = configureStore({
  reducer: {
    rooms: RoomReducer,
    toggle: ToggleReducer,
    mutation: MutationReducer,
    socket: SocketReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false, // Disable strict mode
  //   }),
});
