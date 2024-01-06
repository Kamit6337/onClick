import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import downloadRouter from "./routes/downloadRoutes.js";
import authMiddleware from "./middlewares/socket/authMiddleware.js";
import protectRoute from "./middlewares/protectUserRoutes.js";
import joinConnection from "./controllers/socketControllers/joinConnection.js";
import joinRoom from "./controllers/socketControllers/joinRoom.js";
import { initSocket } from "./lib/initSocket.js";
import { chatImageUpload } from "./lib/multerSetup.js";
import chatMessage from "./controllers/socketControllers/chatMessage.js";

const { io, app, httpServer } = initSocket();

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// app.post("/form", chatImageUpload.single("image"), (req, res, next) => {
//   const body = req.body;
//   const filePath = req.file?.path;

//   res.json({
//     name: "Amit",
//     body,
//     filePath,
//   });
// });

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", protectRoute, userRouter);
app.use("/room", protectRoute, roomRouter);
app.use("/chat", protectRoute, chatRouter);
app.use("/download", protectRoute, downloadRouter);

// NOTE: SOCKET.IO MIDDLEWARES
io.use(authMiddleware);

// NOTE: SOCKET.IO CONNECTION
io.on("connection", (socket) => {
  console.log("User is connected");

  joinConnection(io, socket);

  // MARK: JOIN INTO ROOM
  joinRoom(io, socket);

  // MARK: CHAT MESSAGE SOCKET
  chatMessage(io, socket);
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
