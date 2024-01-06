import express from "express";
import getPDFDownload from "../controllers/downloads/getPDFDownload.js";
import getImageDownload from "../controllers/downloads/getImageDownload.js";

const router = express.Router();

router.get("/pdf", getPDFDownload).get("/image", getImageDownload);

export default router;
