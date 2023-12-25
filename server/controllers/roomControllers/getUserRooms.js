import catchAsyncError from "../../utils/catchAsyncError.js";
import { Room } from "../../models/roomModel.js";
import { Chat } from "../../models/chatModel.js";
import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserRooms = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let rooms = await Room.find({ members: { $in: [userId] } }).lean();

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

  rooms = rooms?.map((room) => {
    if (room.members.length === 2) {
      room.members = room.members.filter((id) => String(id) !== userId);
    }
    return room;
  });

  // Populate members and admin for each room individually
  rooms = await Promise.all(
    rooms.map(async (room) => {
      room = await Room.populate(room, {
        path: "members",
        select: "_id name email photo",
      });
      room = await Room.populate(room, {
        path: "admin",
        select: "_id name email photo",
      });
      return room;
    })
  );

  let roomsId = changeUnderScoreId(rooms);

  roomsId = await Promise.all(
    roomsId.map(async (room) => {
      const chats = await Chat.find({ room: room.id })
        .lean()
        .populate({
          path: "sender",
          select: "_id name email photo",
        })
        .sort("+updatedAt");

      const chatsId = changeUnderScoreId(chats);

      room.chats = chatsId;

      return room;
    })
  );

  roomsId = roomsId.sort((a, b) => b.updatedAt - a.updatedAt);

  const roomList = roomsId.map((room) => room.id);

  res.status(200).json({
    message: "User rooms",
    rooms: roomsId,
    roomList,
  });
});

export default getUserRooms;
