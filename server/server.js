import { environment } from "./utils/environment.js";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";

const PORT = environment.PORT || 8000;

mongoose.connect(environment.mongoDB_url).then(() => {
  console.log("Database is Connected");

  app.listen(environment.PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
  });
});
