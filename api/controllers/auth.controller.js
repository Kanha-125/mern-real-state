import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"

export const signUp = async (req, res, next) => {
    const { username, password, email } = req.body;
    const hashPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, password: hashPassword, email })
    try {
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (err) {
        next(err)
    }

}

