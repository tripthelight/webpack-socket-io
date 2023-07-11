import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as url from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

/** ==============================
 * VARIABLE
 */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.SOCKET_PORT || 4000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

let roomsArr = [];
let roomName = uuidv4();

/** ==============================
 * FUNCTIONS
 */
const SIZE_CHECK = (_room) => {
  return new Promise((resolve, reject) => {
    return resolve(_room.size);
  });
};

/** ==============================
 * MIDDLEWARE
 */

/** ==============================
 * SOCKET.IO
 */
// io connection
io.on("connection", (socket) => {
  if (!socket.adapter.rooms.get(roomName)) {
    socket.join(roomName);
    socket.emit("join-room", roomName);
  } else if (socket.adapter.rooms.get(roomName).size < 2) {
    socket.join(roomName);
    socket.emit("join-room", roomName);
  } else {
    roomName = uuidv4();
    socket.join(roomName);
    socket.emit("join-room", roomName);
  }
});

/** ==============================
 * NAMESPACE
 */

/** ==============================
 * LISTEN
 */
httpServer.listen(PORT, () => {
  console.log(`Socket Server is running\nhttp://localhost:${PORT}`);
});
