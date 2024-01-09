import { initSocket } from "../../lib/initSocket.js";
import { Chat } from "../../models/chatModel.js";
import { Room } from "../../models/roomModel.js";
import path from "path";
import fs from "fs";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const deleteRoomFunction = async (id, findRoom) => {
  const { io } = initSocket();

  const findChats = await Chat.find({ room: id });

  const promises = findChats.map((chat) => {
    if (chat.isFile) {
      const { destination, fileName } = chat.file;
      const fileNameToDelete = `/${destination}/${fileName}`;
      const filePathToDelete = path.join("public", fileNameToDelete);

      // Wrap fs operations in a promise
      const fileDeletionPromise = new Promise((resolve, reject) => {
        fs.access(filePathToDelete, fs.constants.F_OK, (err) => {
          if (err) {
            reject(
              new HandleGlobalError(
                `File ${fileNameToDelete} does not exist.`,
                404
              )
            );
          } else {
            fs.unlink(filePathToDelete, (unlinkErr) => {
              if (unlinkErr) {
                reject(
                  new HandleGlobalError(
                    `Error deleting file: ${unlinkErr}`,
                    404
                  )
                );
              } else {
                console.log(`File ${fileNameToDelete} deleted successfully.`);
                resolve();
              }
            });
          }
        });
      });

      return fileDeletionPromise;
    }
  });

  await Promise.all(promises);

  await Chat.deleteMany({ room: id });

  await Room.deleteOne({ _id: id });

  io.emit("deleteRoom", { members: findRoom.members }, (response) => {
    if (response.status !== "ok") {
      console.log("response from delete room", response);
    }
  });
};

export default deleteRoomFunction;
