import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const catchedToken = req.cookies.access_token;
    if (!catchedToken) {
        return next(errorHandler(401, "Unauthorized Access"));
    }
    jwt.verify(catchedToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, "Token Expired"));
        }
        req.user = user;
        next();
    })
}