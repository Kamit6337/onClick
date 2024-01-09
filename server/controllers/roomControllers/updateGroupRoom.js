import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { initSocket } from "../../lib/initSocket.js";

const updateGroupRoom = catchAsyncError(async (req, res, next) => {
  let { name, members, admin, id } = req.body;

  const { io } = initSocket();

  if (!id || !name || !members || !admin) {
    return next(new HandleGlobalError("Not provided all fields", 404));
  }

  members = JSON.parse(members);

  const filePath = req.file?.path;

  if (!filePath) {
    const updated = await Room.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name,
        members,
        updatedAt: Date.now(),
        admin,
      },
      {
        new: true,
      }
    );

    io.emit("updateGroupRoom", { members });

    res.status(200).json({
      message: "Successfully updated",
      data: updated,
    });

    return;
  } else {
    // Modify the filePath to replace backslashes with forward slashes
    const modifiedFilePath = filePath
      .replace(/\\/g, "/")
      .replace("public/", "");

    const updated = await Room.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name,
        members,
        photo: modifiedFilePath,
        updatedAt: Date.now(),
        admin,
      },
      {
        new: true,
      }
    );

    io.emit("updateGroupRoom", { members });

    res.status(200).json({
      message: "Successfully updated",
      data: updated,
    });

    return;
  }
});

export default updateGroupRoom;
