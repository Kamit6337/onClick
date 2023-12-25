import { Chat } from "../../models/chatModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";

const getRoomChats = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Room ID is not provided", 404));
  }

  const chats = await Chat.find({ room: id })
    .lean()
    .populate({
      path: "sender",
      select: "_id name email photo",
    })
    .sort("+updatedAt");

  const chatsId = changeUnderScoreId(chats);

  res.status(200).json({
    message: `Chats of Room : ${id}`,
    data: chatsId,
  });
});

export default getRoomChats;
