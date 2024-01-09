import express from "express";
import getRoomChats from "../controllers/chatControllers/getRoomChats.js";
import chatImage from "../controllers/chatControllers/chatImage.js";
import { chatImageUpload, chatPDFUpload } from "../lib/multerSetup.js";
import chatPdf from "../controllers/chatControllers/chatPdf.js";
import deleteChat from "../controllers/chatControllers/deleteChat.js";

const router = express.Router();

router.route("/").get(getRoomChats).delete(deleteChat);

router
  .post("/image", chatImageUpload.single("image"), chatImage)
  .post("/pdf", chatPDFUpload.single("pdf"), chatPdf);

export default router;
