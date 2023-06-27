import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as url from "url";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

/**
 * VARIABLE
 */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const APP = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(APP);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("소켓IO 연결 성공 >> ");
  socket.on("test-event", (arg, callback) => {
    console.log(arg);
    callback("got it!!");
    // io.emit("test-event-send", data);
  });
});

/**
 * MIDDLEWARE
 */
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

/**
 * APIs
 */
APP.get("/", (req, res) => {
  res.json({
    success: true,
  });
});

/**
 * LISTEN
 */
httpServer.listen(PORT, () => {
  console.log(`Server is running\nhttp://localhost:${PORT}`);
});
