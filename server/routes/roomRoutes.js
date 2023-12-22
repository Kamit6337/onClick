import express from "express";
import getUserRooms from "../controllers/roomControllers.js/getUserRooms.js";
import createSingleRoom from "../controllers/roomControllers.js/createSingleRoom.js";
import updateRoom from "../controllers/roomControllers.js/updateRoom.js";
import deleteRoom from "../controllers/roomControllers.js/deleteRoom.js";
import createGroupRoom from "../controllers/roomControllers.js/createGroupRoom.js";

const router = express.Router();

router.post("/group", createGroupRoom);

router
  .route("/")
  .get(getUserRooms)
  .post(createSingleRoom)
  .patch(updateRoom)
  .delete(deleteRoom);

export default router;
