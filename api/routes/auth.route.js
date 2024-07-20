import express from "express";
import { signIn, signTinGoogle, signUp } from "../controllers/auth.controller.js";


const router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/google', signTinGoogle)


export default router;