import sharp from "sharp";
import { environment } from "../../utils/environment.js";
import { Chat } from "../../models/chatModel.js";

const chatImage = (io, socket) => {
  socket.on("image", async (arg, callback) => {
    const userId = socket.userId;
    const user = socket.user;
    const { room, fileName, body } = arg;

    const filePath = `public/images/${fileName}`;
    const saveFilPath = `images/${fileName}`;

    try {
      const image = await sharp(body).jpeg().toFile(filePath);
      console.log("image", image);

      const createChat = await Chat.create({
        room,
        sender: userId,
        photo: saveFilPath,
      });

      createChat.sender = user;

      io.to(room).emit("image", createChat, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  });
};

export default chatImage;
