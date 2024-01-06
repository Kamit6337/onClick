import express from "express";
import getUserRooms from "../controllers/roomControllers/getUserRooms.js";
import deleteRoom from "../controllers/roomControllers/deleteRoom.js";
import createGroupRoom from "../controllers/roomControllers/createGroupRoom.js";
import createSingleRoom from "../controllers/roomControllers/createSingleRoom.js";
import { groupChatProfileUpload } from "../lib/multerSetup.js";
import updateGroupRoom from "../controllers/roomControllers/updateGroupRoom.js";

const router = express.Router();

router.route("/").get(getUserRooms).delete(deleteRoom);

router.post("/single", createSingleRoom);

router
  .route("/group")
  .post(groupChatProfileUpload.single("image"), createGroupRoom)
  .patch(groupChatProfileUpload.single("image"), updateGroupRoom);

export default router;
