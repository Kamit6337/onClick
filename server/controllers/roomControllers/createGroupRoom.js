import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { initSocket } from "../../lib/initSocket.js";

const groupPic = `images/groupChatProfile/dummy_group.jpeg`;

const createGroupRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { io } = initSocket();

  let { name, members } = req.body;

  console.log("createGroupRoom", name, members);

  if (!name || !members) {
    return next(new HandleGlobalError("Not provided name or members", 404));
  }

  members = JSON.parse(members);

  const filePath = req.file?.path;

  if (!filePath) {
    await Room.create({
      name,
      members,
      photo: groupPic,
      admin: userId,
      isGroupChat: true,
    });

    io.emit("groupRoom", { members });

    res.status(200).json({
      message: "Group Room is created",
    });

    return;
  } else {
    // Modify the filePath to replace backslashes with forward slashes
    const modifiedFilePath = filePath
      .replace(/\\/g, "/")
      .replace("public/", "");

    await Room.create({
      name,
      members,
      photo: modifiedFilePath,
      admin: userId,
      isGroupChat: true,
    });

    io.emit("groupRoom", { members });

    res.status(200).json({
      message: "Group Room is created",
    });

    return;
  }
});
export default createGroupRoom;
