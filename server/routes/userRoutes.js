import express from "express";

const router = express.Router();

router.get("/all");

router.route("/").patch().delete();

export default router;
