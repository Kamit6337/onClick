import express from "express";
import "./utils/passport.js";
import { Server } from "socket.io";
import { createServer } from "http";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { environment } from "./utils/environment.js";
import authMiddleware from "./middlewares/socket/authMiddleware.js";
import protectRoute from "./middlewares/protectUserRoutes.js";
import joinConnection from "./controllers/socketControllers/joinConnection.js";
import joinRoom from "./controllers/socketControllers/joinRoom.js";
import createSingleRoom from "./controllers/socketControllers/createSingleRoom.js";
import chatMessage from "./controllers/socketControllers/chatMessage.js";
import chatImage from "./controllers/socketControllers/chatImage.js";
import createGroupChat from "./controllers/socketControllers/createGroupChat.js";
import updateGroupChat from "./controllers/socketControllers/updateGroupChat.js";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin:
      environment.NODE_ENV === "production" ? false : ["http://localhost:5173"],
  },
});

// NOTE: GLOBAL MIDDLEWARES
app.use(globalMiddlewares());

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", protectRoute, userRouter);
app.use("/room", protectRoute, roomRouter);
app.use("/chat", protectRoute, chatRouter);

// NOTE: SOCKET.IO MIDDLEWARES
io.use(authMiddleware);

// NOTE: SOCKET.IO CONNECTION

io.on("connection", (socket) => {
  console.log("User is connected");

  joinConnection(io, socket);

  // MARK: JOIN INTO ROOM
  joinRoom(io, socket);

  // MARK: CREATE SINGLE ROOM
  createSingleRoom(io, socket);

  // MARK: CHAT MESSAGE SOCKET
  chatMessage(io, socket);

  // MARK: CHAT IMAGE SOCKET
  chatImage(io, socket);

  // MARK: CREATE GROUP CHAT
  createGroupChat(io, socket);

  // MARK: UPDATE GROUP CHAT
  updateGroupChat(io, socket);
});

// NOTE: UNIDENTIFIED ROUTES
app.all("*", (req, res, next) => {
  return next(
    new HandleGlobalError(
      `Somethings went wrong. Please check your Url - ${req.originalUrl}`,
      500,
      "Fail"
    )
  );
});

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default httpServer;
