import { environment } from "./utils/environment.js";
import { User } from "./models/userModel.js";
import mongoose from "mongoose";

mongoose.connect(environment.mongoDB_url);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Terminate the application on connection error
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Assuming 'OAuthId' is the field with the unique index
const indexKey = { OAuthId: 1 }; // 1 for ascending order, -1 for descending order

const dropIndexAsync = (model, indexKey) => {
  return new Promise((resolve, reject) => {
    model.collection.dropIndex(indexKey, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Usage:
dropIndexAsync(User, indexKey)
  .then((result) => {
    console.log("Index dropped successfully:", result);
    mongoose.connection.close(); // Close the connection after the operation
  })
  .catch((err) => {
    console.error("Error dropping index:", err);
    mongoose.connection.close(); // Close the connection on error
  });
