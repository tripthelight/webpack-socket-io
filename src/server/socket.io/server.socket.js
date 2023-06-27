import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as url from "url";
import { createServer } from "http";
import { Server } from "socket.io";

/** ==============================
 * VARIABLE
 */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.SOCKET_PORT || 4000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/** ==============================
 * MIDDLEWARE
 */

/** ==============================
 * SOCKET.IO
 */
// io connection
io.on("connection", (socket) => {
  // socket.on("test-event", (arg, callback) => {
  //   callback("got it 11");
  // });
  // socket.on("async-send", (arg, callback) => {
  //   callback("async send return");
  // });
});

/** ==============================
 * NAMESPACE
 */
const ROOM = io.of("/room");
const CHAT = io.of("/chat");

// namespace: ROOM connection
ROOM.on("connection", (socket) => {
  const roomId = "room1";

  socket.join(roomId);
  socket.to(roomId).emit("join-room", roomId);

  socket.on("welcome", (data) => {
    socket.emit("welcome-res", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

/** ==============================
 * LISTEN
 */
httpServer.listen(PORT, () => {
  console.log(`Socket Server is running\nhttp://localhost:${PORT}`);
});
