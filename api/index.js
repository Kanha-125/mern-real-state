import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("database is connected"))
    .catch((err) => {
        console.log(err)
    })

const app = express();


app.listen(4000, () => {
    console.log("server is listeing on 4000 !!")
})