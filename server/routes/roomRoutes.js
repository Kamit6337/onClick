import express from "express";
import getUserRooms from "../controllers/roomControllers/getUserRooms.js";
import createGroupRoom from "../controllers/roomControllers/createGroupRoom.js";
import createSingleRoom from "../controllers/roomControllers/createSingleRoom.js";
import { groupChatProfileUpload } from "../lib/multerSetup.js";
import updateGroupRoom from "../controllers/roomControllers/updateGroupRoom.js";
import deleteSingleRoom from "../controllers/roomControllers/deleteSingleRoom.js";
import deleteGroupRoom from "../controllers/roomControllers/deleteGroupRoom.js";

const router = express.Router();

router.route("/").get(getUserRooms);

router.route("/single").post(createSingleRoom).delete(deleteSingleRoom);

router
  .route("/group")
  .post(groupChatProfileUpload.single("image"), createGroupRoom)
  .patch(groupChatProfileUpload.single("image"), updateGroupRoom)
  .delete(deleteGroupRoom);

export default router;
