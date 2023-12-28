import express from "express";
import getAllUser from "../controllers/userControllers/getAllUser.js";
import upload from "../lib/multerSetup.js";
import updateUserPhoto from "../controllers/userControllers/updateUser.js";
import updateUserProfile from "../controllers/userControllers/updateUserProfile.js";

const router = express.Router();

router.get("/all", getAllUser);

router.patch("/photo", upload.single("image"), updateUserPhoto);

router.route("/").patch(updateUserProfile);

export default router;
