import express from "express";
import { addWord , qz } from "../Controller/userController.js";

const router = express.Router();

router.post("/add",addWord);
router.get("/qz",qz);


export default router;

