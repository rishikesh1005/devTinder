const dns = require("dns");

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
const http = require("http")
const initializeSocket = require("./utils/socket.js");
const errorHandler = require("./middleware/errorHandler.js")

require('dotenv').config()

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)
app.use("/" , chatRouter)

app.use(errorHandler)

const server = http.createServer(app);
initializeSocket(server);


connectDB()
    .then(() => {
        console.log("DB Connected!!!");

        server.listen(process.env.PORT , () => {
            console.log("connection successfull at port 7777....");
        });
    })
    .catch((err) => {
        console.error("DB not connected!!!")
        console.error(err)
        console.error("Message:", err.message);
    console.error("Name:", err.name);
    }
);


