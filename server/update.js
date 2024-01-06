import { environment } from "./utils/environment.js";
import { User } from "./models/userModel.js";
import { Chat } from "./models/chatModel.js";
import mongoose from "mongoose";
import { Room } from "./models/roomModel.js";

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

// NOTE: DELETE CHAT
// try {
//   const chats = await Chat.deleteMany();
//   const rooms = await Room.deleteMany();
//   const users = await User.deleteMany();
//   console.log("Chats has been deleted", chats);
//   console.log("rooms has been deleted", rooms);
//   console.log("users has been deleted", users);

//   mongoose.connection.close();
// } catch (error) {
//   console.log("error", error);

//   mongoose.connection.close();
// }

// NOTE: DELETE ROOM AND CHAT DATA COMPLETELY
// try {
//   const deleteRooms = await Room.deleteMany();

//   console.log("Rooms has been deleted", deleteRooms);

//   const deleteChats = await Chat.deleteMany();

//   console.log("Chats has been deleted", deleteChats);

//   mongoose.connection.close();
// } catch (error) {
//   console.log("error", error);

//   mongoose.connection.close();
// }

// NOTE: UPDATE ROOM

// try {
//   const chats = await Room.deleteMany({ name: "me and you" });

//   console.log("update room", chats);

//   mongoose.connection.close();
// } catch (error) {
//   console.log("error", error);
//   mongoose.connection.close();
// }

// NOTE: CHAT
try {
  const updateResult = await Chat.updateMany(
    {},
    {
      $unset: {
        fileType: "",
      },
    }
  );

  console.log("Chat fields updated successfully", updateResult);
  mongoose.connection.close();
} catch (error) {
  console.log("Error updating chat fields", error);
  mongoose.connection.close();
}

// NOTE: TO REMOVE UNIQUENESS FROM A SCHEMA
// Assuming 'OAuthId' is the field with the unique index
// const indexKey = { OAuthId: 1 }; // 1 for ascending order, -1 for descending order

// const dropIndexAsync = (model, indexKey) => {
//   return new Promise((resolve, reject) => {
//     model.collection.dropIndex(indexKey, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };

// // Usage:
// dropIndexAsync(User, indexKey)
//   .then((result) => {
//     console.log("Index dropped successfully:", result);
//     mongoose.connection.close(); // Close the connection after the operation
//   })
//   .catch((err) => {
//     console.error("Error dropping index:", err);
//     mongoose.connection.close(); // Close the connection on error
//   });
