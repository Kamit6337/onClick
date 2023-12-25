import express from "express";
import getRoomChats from "../controllers/chatControllers/getRoomChats.js";

const router = express.Router();

router.route("/").get(getRoomChats);

export default router;
