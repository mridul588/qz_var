import express from "express";
import { addWord , qz, submitAnswer ,submitAnswerFlash} from "../Controller/userController.js";

const router = express.Router();

router.post("/add",addWord);
router.post("/qz",qz);
router.post("/submitAnswer",submitAnswer);
router.post("/submitAnswerFlash",submitAnswerFlash);


export default router;

