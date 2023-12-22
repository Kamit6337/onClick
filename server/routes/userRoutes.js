import express from "express";
import getAllUser from "../controllers/userControllers/getAllUser.js";

const router = express.Router();

router.get("/all", getAllUser);

// router.route("/").patch().delete();

export default router;
