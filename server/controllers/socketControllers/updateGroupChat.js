import { Room } from "../../models/roomModel.js";
import sharp from "sharp";

const updateGroupChat = (io, socket) => {
  socket.on("updateGroupChat", async (arg, callback) => {
    // const obj = {
    //   id: activeRoom,
    //   name,
    //   members: membersId,
    //   photo: { body: file },
    // };

    console.log("arg", arg);

    const { name, members, admin, photo, id } = arg;

    if (!photo) {
      try {
        const updated = await Room.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            members,
          },
          {
            new: true,
          }
        );

        console.log("updated", updated);

        callback({ status: "ok" });

        return;
      } catch (error) {
        callback({ error: error.message });
        console.log("error !photo", error);
      }
    } else {
      try {
        const filePath = `public/images/groupChatProfile/image_${Date.now()}.jpeg`;
        const saveFilePath = `images/groupChatProfile/image_${Date.now()}.jpeg`;

        await sharp(photo).jpeg().toFile(filePath);

        const updated = await Room.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            members,
            photo: saveFilePath,
          },
          {
            new: true,
          }
        );

        console.log("updated", updated);

        callback({ status: "ok" });

        return;
      } catch (error) {
        callback({ error: error.message });

        console.log("error in photo", error);
      }
    }
  });
};

export default updateGroupChat;
