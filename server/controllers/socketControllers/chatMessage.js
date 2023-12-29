import { Chat } from "../../models/chatModel.js";

const chatMessage = (io, socket) => {
  socket.on("chat", async (arg, callback) => {
    const userId = socket.userId;
    const userName = socket.userName;
    const user = socket.user;

    const { room, message } = arg;

    try {
      const createChat = await Chat.create({
        room,
        message,
        sender: userId,
      });

      if (!createChat) {
        console.log("Error in chat creation");
        return;
      }

      createChat.sender = user;

      io.to(room).emit("chatMsg", createChat, (err) => {
        if (err) {
          console.log(err);
        }
      });

      callback({ status: "ok" });
    } catch (error) {
      console.log("error", error);
    }
  });
};

export default chatMessage;
