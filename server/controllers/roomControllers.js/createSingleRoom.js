import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createSingleRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let { id } = req.body;

  if (!id || id === userId) {
    return next(new HandleGlobalError("Not provide the Id", 404));
  }

  const members = [id, userId];

  const findRoom = await Room.findOne({ members });

  if (findRoom) {
    return next(new HandleGlobalError("Room is already present", 404));
  }

  const room = await Room.create({
    members,
  });

  if (!room) {
    return next(new HandleGlobalError("Issue in room creation", 403));
  }

  res.status(200).json({
    message: "Single Room is created",
    data: room,
  });
});

export default createSingleRoom;
