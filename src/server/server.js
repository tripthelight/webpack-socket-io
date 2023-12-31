import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as url from "url";
// express
import express from "express";
// socket.io
import { createServer } from "http";
import { Server } from "socket.io";

/** ==============================
 * VARIABLE
 */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const APP = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(APP);
// socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/** ==============================
 * MIDDLEWARE
 */
// express
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

/** ==============================
 * SOCKET.IO
 */

/**
 * NAMESPACE
 */
const ROOM = io.of("/room");
const CHAT = io.of("/chat");

// ioc connection
io.on("connection", (socket) => {
  // socket.on("test-event", (arg, callback) => {
  //   callback("got it 11");
  // });
  // socket.on("async-send", (arg, callback) => {
  //   callback("async send return");
  // });
});
// namespace: ROOM connection
ROOM.on("connection", (socket) => {
  console.log("ROOM 네임스페이스 접속");
  socket.on("disconnect", () => {
    console.log("ROOM 네임스페이스 접속 해제");
  });
  socket.emit("newRoom", "방 만들어");
});
// namespace: CHAT connection
CHAT.on("connection", (socket) => {
  console.log("CHAT 네임스페이스 접속");
  socket.on("disconnect", () => {
    console.log("CHAT 네임스페이스 접속 해제");
  });
  socket.emit("join", "참여");
});

/** ==============================
 * APIs
 */
APP.get("/", (req, res) => {
  res.json({
    success: true,
  });
});

/** ==============================
 * LISTEN
 */
httpServer.listen(PORT, () => {
  console.log(`Server is running\nhttp://localhost:${PORT}`);
});
