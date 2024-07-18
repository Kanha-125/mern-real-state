import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import useRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cors from "cors"

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("database is connected"))
    .catch((err) => {
        console.log(err)
    })

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/user", useRouter);
app.use("/api/auth", authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    res.status(statusCode).json({ success: false, message, statusCode })
})


app.listen(4000, () => {
    console.log("server is listeing on 4000 !!")
})