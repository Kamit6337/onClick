import express from "express";
import getUserRooms from "../controllers/roomControllers/getUserRooms.js";
import updateRoom from "../controllers/roomControllers/updateRoom.js";
import deleteRoom from "../controllers/roomControllers/deleteRoom.js";
import createGroupRoom from "../controllers/roomControllers/createGroupRoom.js";

const router = express.Router();

router.route("/").get(getUserRooms).patch(updateRoom).delete(deleteRoom);

export default router;
