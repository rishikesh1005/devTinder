const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")

require('dotenv').config()

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)

connectDB()
    .then(() => {
        console.log("DB Connected!!!");

        app.listen(process.env.PORT , () => {
            console.log("connection successfull at port 7777....");
        });
    })
    .catch(err => {
        console.error("DB not connected!!!")
    }
);


