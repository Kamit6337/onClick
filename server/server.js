import { environment } from "./utils/environment.js";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import httpServer from "./app.js";

const PORT = environment.PORT || 8080;

mongoose.connect(environment.mongoDB_url);

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  httpServer.listen(environment.PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// mongoose.connect(environment.mongoDB_url).then(() => {
//   console.log("Database is Connected");

//   app.listen(environment.PORT, () => {
//     console.log(`Server is connected on port ${PORT}`);
//   });
// });
