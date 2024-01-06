import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { environment } from "../utils/environment.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin:
      environment.NODE_ENV === "production" ? false : ["http://localhost:5173"],
  },
});
export const initSocket = () => {
  return { httpServer, io, app };
};
