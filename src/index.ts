import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from './router'

require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(cors({
    credentials: true,
}))
app.use(cookieParser());
app.use(compression());

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Hello World Arijit!");
    });

server.listen(8001, () => {
    console.log("Server running on http://localhost:8001");
    });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI)
mongoose.connection.on("error", (error: Error) => {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(-1);
    });

app.use('/', router());