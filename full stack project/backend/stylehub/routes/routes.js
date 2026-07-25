import { signIn } from "../controllers/adminController.js";
import express from "express"

const Router =  express.Router();
router.post("/",signIn)


export default Router