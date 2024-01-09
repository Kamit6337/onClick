import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { initSocket } from "../../lib/initSocket.js";
import deleteRoomFunction from "../functions/deleteRoomFunction.js";
import path from "path";
import fs from "fs";

const deleteGroupRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { io } = initSocket();

  const { id } = req.query;

  console.log("delete room", id);

  if (!id) {
    return next(new HandleGlobalError("room id is not provided", 404));
  }

  const findRoom = await Room.findOne({ _id: id });

  const filePathToDelete = path.join("public", findRoom?.photo);

  fs.access(filePathToDelete, fs.constants.F_OK, (err) => {
    if (err) {
      return next(
        new HandleGlobalError(`group profile photo does not exist.`, 404)
      );
    } else {
      fs.unlink(filePathToDelete, (unlinkErr) => {
        if (unlinkErr) {
          return next(
            new HandleGlobalError(`Error deleting file: ${unlinkErr}`, 404)
          );
        } else {
          console.log(`Group Profile photo deleted successfully.`);
        }
      });
    }
  });

  if (String(findRoom.admin) !== userId) {
    await Room.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $pull: { members: userId },
      }
    );

    io.emit("deleteRoom", { members: findRoom.members }, (response) => {
      if (response.status !== "ok") {
        console.log("response from delete room", response);
      }
    });

    res.status(200).json({
      message: "You are removed from the group",
    });

    return;
  }

  await deleteRoomFunction(id, findRoom);

  res.status(200).json({
    message: "Group chat successfully deleted along with its chats",
  });
});

export default deleteGroupRoom;
