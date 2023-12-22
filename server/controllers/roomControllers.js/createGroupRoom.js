import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createGroupRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let { id, name, admin = userId } = req.body;

  const findUser = id?.includes(userId);

  if (!id || id.length === 0 || name) {
    return next(new HandleGlobalError("Not provide the Id", 404));
  }

  let members = new Set([...id, userId]);
  members = [...members];

  const room = await Room.create({
    name,
    members,
    admin,
  });

  if (!room) {
    return next(new HandleGlobalError("Issue in room creation", 403));
  }

  res.status(200).json({
    message: "Group Room is created",
    data: room,
  });
});
export default createGroupRoom;
