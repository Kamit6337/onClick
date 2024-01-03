import { Room } from "../../models/roomModel.js";

const createSingleRoom = (io, socket) => {
  socket.on("createSingleRoom", async (arg, callback) => {
    const userId = socket.userId;
    const { id } = arg;

    if (!id || id === userId) {
      console.log("Not provide the Id");
      return;
    }
    const members = [id, userId];

    try {
      const findRoom = await Room.findOne({ members });

      if (findRoom) {
        console.log("Room is already present");
        return;
      }

      await Room.create({
        members,
      });

      // if (!room) {
      //   console.log("Issue in room creation");
      //   return;
      // }

      io.emit("singleRoomCreated", { members });

      callback({ status: "ok" });
    } catch (error) {
      callback({ error: error.message });
    }
  });
};

export default createSingleRoom;
