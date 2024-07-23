import express from "express";
import { deleteUser, updateUser, UserListings, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

router.get('/test', (req, res) => {
    res.send("hello")
})

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, UserListings);
router.get('/:id', verifyToken, getUser)


export default router;