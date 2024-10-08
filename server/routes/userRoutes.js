import express from "express";
import { addWord , qz, submitAnswer ,submitAnswerFlash, getUserWords} from "../Controller/userController.js";

const router = express.Router();

router.post("/add",addWord);
router.post("/qz",qz);
router.post("/submitAnswer",submitAnswer);
router.post("/submitAnswerFlash",submitAnswerFlash);
router.get("/", (req,res)=> {res.send("hellp")});
router.get("/words/:id", getUserWords); //for getting user words :


export default router;

