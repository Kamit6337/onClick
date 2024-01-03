import sharp from "sharp";
import { Room } from "../../models/roomModel.js";

// WORK: PLACED A DUMMY URL IN CASE USER DOES NOT PROVIDE PHOTO
const groupPic = `images/dummy_group.jpeg`;

const createGroupChat = (io, socket) => {
  socket.on("createGroupChat", async (arg, callback) => {
    console.log("make request");

    const userId = socket.userId;

    const { name, members, photo } = arg;

    if (!photo) {
      try {
        const created = await Room.create({
          name,
          members,
          photo: groupPic,
          admin: userId,
          isGroupChat: true,
        });
        console.log("created", created);

        callback({ status: "ok" });

        return;
      } catch (error) {
        callback({ error: error });
        console.log("error !photo", error);
      }
    } else {
      try {
        const filePath = `public/images/groupChatProfile/image_${Date.now()}.jpeg`;
        const saveFilePath = `images/groupChatProfile/image_${Date.now()}.jpeg`;

        // const filePath = `public/images/${fileName}`;
        // const saveFilePath = `images/${fileName}`;

        await sharp(photo).jpeg().toFile(filePath);

        await Room.create({
          name,
          members,
          photo: saveFilePath,
          admin: userId,
          isGroupChat: true,
        });

        callback({ status: "ok" });

        return;
      } catch (error) {
        callback({ error: error });

        console.log("error in photo", error);
      }
    }
  });
};

export default createGroupChat;
