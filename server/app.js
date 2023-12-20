import express from "express";
import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();

// NOTE: GLOBAL MIDDLEWARES
app.use(globalMiddlewares);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/chat", chatRouter);

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

export default app;
