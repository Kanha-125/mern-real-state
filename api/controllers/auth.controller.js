import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
    const { password, email } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const isPasswordValid = bcryptjs.compareSync(password, validUser.password);
        if (!isPasswordValid) {
            return next(errorHandler(401, 'Invalid credentials'));
        }
        const token = await jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: hashPassword, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

    } catch (err) {

    }
}

