import { initSocket } from "../../lib/initSocket.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const createSingleRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.body;
  const { io } = initSocket();

  if (!id || id === userId) {
    return next(new HandleGlobalError("Not provided correct ID", 404));
  }

  const members = [id, userId];

  const findRoom = await Room.findOne({ members });

  if (findRoom) {
    console.log();
    return next(new HandleGlobalError("Room is already present", 404));
  }

  await Room.create({
    members,
  });

  io.emit("singleRoom", { members });

  res.status(200).json({
    message: "Room is created",
  });
});

export default createSingleRoom;
