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
import { Chat } from "./models/chatModel.js";

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
app.use("/chat", chatRouter);

// NOTE: SOCKET.IO MIDDLEWARES
io.use(authMiddleware);

// NOTE: SOCKET.IO CONNECTION

io.on("connection", (socket) => {
  console.log("User is connected");

  socket.emit("joinConnection", "ok", (err) => {
    if (err) {
      console.log(err);
    }
  });

  socket.on("joinRoom", (arg, callback) => {
    const { rooms } = arg;

    rooms.forEach((room) => {
      socket.join(room);
    });

    callback({ status: "ok" });
  });

  socket.on("chat", async (arg, callback) => {
    const userId = socket.userId;
    const userName = socket.userName;
    const user = socket.user;

    const { room, message } = arg;

    const res = {
      message,
      name: userName,
      sender: userId,
      room,
    };

    const createChat = await Chat.create({
      room,
      message,
      sender: userId,
    });

    if (!createChat) {
      console.log("Error in chat creation");
      return;
    }

    createChat.sender = user;

    io.to(room).emit("chatMsg", createChat, (err) => {
      if (err) {
        console.log(err);
      }
    });

    callback({ status: "ok" });
  });
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
