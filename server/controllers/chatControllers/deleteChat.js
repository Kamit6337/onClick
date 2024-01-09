import { Chat } from "../../models/chatModel.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import fs from "fs";
import path from "path";

const deleteChat = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.query;
  console.log("id", id);

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  //   MARK: FIND FIRST THE CHAT FROM ID
  const findChat = await Chat.findOne({ _id: id });

  console.log("findChat", findChat);

  // MARK: TO CHECK WHETHER USER IS SAME AS SENDER OR NOT
  if (String(findChat?.sender) !== userId) {
    return next(new HandleGlobalError("you are not authorised to delete", 403));
  }

  // MARK: CHECK WHETHER THIS CHAT IS MESSAGE OR FILE. IF FILE DELETE THAT FILE FROM PUBLIC FOLDER FIRST
  if (findChat?.isFile) {
    const { destination, fileName } = findChat.file;

    const fileNameToDelete = `/${destination}/${fileName}`; // Change this to your actual file name

    // Construct the full path to the file
    const filePathToDelete = path.join("public", fileNameToDelete);

    // Check if the file exists before attempting to delete it
    fs.access(filePathToDelete, fs.constants.F_OK, (err) => {
      if (err) {
        return next(
          new HandleGlobalError(`File ${fileNameToDelete} does not exist.`, 404)
        );
      } else {
        // File exists, so proceed with deletion
        fs.unlink(filePathToDelete, (unlinkErr) => {
          if (unlinkErr) {
            return next(
              new HandleGlobalError(`Error deleting file: ${unlinkErr}`, 404)
            );
          } else {
            console.log(`File ${fileNameToDelete} deleted successfully.`);
          }
        });
      }
    });
  }

  // MARK: AT LAST DELETE THE CHAT FROM DATABASE
  await Chat.deleteOne({ _id: id });

  // MARK: UPDATE ROOM AFTER CHAT IS DELETED
  await Room.findOneAndUpdate(
    {
      _id: findChat.room,
    },
    {
      updatedAt: Date.now(),
    }
  );

  res.status(200).json({
    message: "Chat successfully deleted",
  });
  return;
});

export default deleteChat;
