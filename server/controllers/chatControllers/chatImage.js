import { initSocket } from "../../lib/initSocket.js";
import { Chat } from "../../models/chatModel.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const chatImage = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;
  const { io } = initSocket();

  const { room } = req.body;

  if (!room) {
    return next(new HandleGlobalError("Room ID is not provided", 404));
  }

  let {
    originalname: originalName,
    destination,
    size,
    filename: fileName,
  } = req.file;

  destination = destination.replace("public/", "");

  // Modify the filePath to replace backslashes with forward slashes
  // const modifiedFilePath = filePath.replace(/\\/g, "/").replace("public/", "");

  const createChat = await Chat.create({
    room,
    sender: userId,
    file: {
      destination,
      fileName,
      fileType: "image",
      originalName,
      size,
    },
  });

  await Room.findOneAndUpdate(
    {
      _id: room,
    },
    {
      updatedAt: Date.now(),
    }
  );

  createChat.sender = user;

  io.to(room).emit("chatFile", createChat);

  res.status(200).json({
    message: "Successfully uploaded Image.",
  });
});

export default chatImage;
