import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserRooms = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let rooms = await Room.find({ members: { $in: [userId] } })
    .lean()
    .populate({
      path: "members",
      select: "_id name email photo",
    })
    .populate({
      path: "admin",
      select: "_id name email photo",
    });

  if (!rooms) {
    return next(new HandleGlobalError("Error in getting rooms", 404));
  }

  if (rooms.length === 0) {
    res.status(200).json({
      message: "No Room availbale",
      rooms: [],
      roomList: [],
    });
    return;
  }

  let roomsId = changeUnderScoreId(rooms);

  roomsId = roomsId.sort((a, b) => b.updatedAt - a.updatedAt);

  res.status(200).json({
    message: "User rooms",
    data: roomsId,
  });
});

export default getUserRooms;
