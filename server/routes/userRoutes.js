import express from "express";
import { addWord , qz, submitAnswer } from "../Controller/userController.js";

const router = express.Router();

router.post("/add",addWord);
router.post("/qz",qz);
router.post("/submitAnswer",submitAnswer);


export default router;

