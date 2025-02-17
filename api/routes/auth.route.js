import express from "express";
import { signIn, signOut, signTinGoogle, signUp } from "../controllers/auth.controller.js";


const router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/google', signTinGoogle)
router.get('/signout', signOut)

export default router;