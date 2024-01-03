import sharp from "sharp";
import { Chat } from "../../models/chatModel.js";
import { Room } from "../../models/roomModel.js";

const chatImage = (io, socket) => {
  socket.on("image", async (arg, callback) => {
    const userId = socket.userId;
    const user = socket.user;
    const { room, photo } = arg;

    const filePath = `public/images/chat/image_${Date.now()}.jpeg`;
    const saveFilePath = `images/chat/image_${Date.now()}.jpeg`;

    try {
      await sharp(photo).jpeg().toFile(filePath);

      const createChat = await Chat.create({
        room,
        sender: userId,
        photo: saveFilePath,
      });

      await Room.findOneAndUpdate(
        {
          _id: room,
        },
        {
          updatedAt: Date.now(),
        }
      );

      createChat.sender = user;

      io.to(room).emit("image", createChat, (err) => {
        if (err) {
          console.log(err);
        }
      });

      callback({ status: "ok" });
    } catch (error) {
      callback({ error: error.message });

      console.log("error", error);
    }
  });
};

export default chatImage;
