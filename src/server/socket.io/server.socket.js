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

/** ==============================
 * MIDDLEWARE
 */

/** ==============================
 * SOCKET.IO
 */
// io connection
// io.on("connection", (socket) => {});

/** ==============================
 * NAMESPACE
 */
const NAMESPACE1 = "namespace1";
const NS1 = io.of(`/${NAMESPACE1}`);
let roomName = uuidv4();
let roomArr = [];
roomArr.push(roomName);

// namespace: ROOM connection
io.on("connection", (socket) => {
  socket.on("create-room", (namespace) => {
    const NS = io.of(`/${namespace}`);
    const ROOM = NS.adapter.rooms.get(roomArr[0]);

    if (!ROOM) {
      socket.join(roomArr[0]);
      socket.emit("join-room", roomArr[0]);
      console.log(socket.adapter.rooms.get(roomArr[0]));
    }

    // if (!ROOM) {
    //   socket.join(roomArr[0]);
    //   socket.emit("join-room", roomArr[0]);
    // } else if (ROOM.size < 2) {
    //   socket.join(roomArr[0]);
    //   socket.emit("join-room", roomArr[0]);
    // } else {
    //   // socket.emit("room-full");
    //   console.log(ROOM);
    //   roomArr = [];
    //   roomArr.push(roomName);
    // }
  });
  // socket.on("join-room", (roomName, namespace) => {
  //   const room = NAMESPACE1.adapter.rooms.get(roomName);
  //   if (!room) {
  //     // Room doesn't exist, create it
  //     socket.join(roomName);
  //     socket.emit("join-room");
  //     console.log(`Client joined room ${roomName} in namespace ${namespace}`);
  //   } else if (room.size < 2) {
  //     // Room exists but has space, join it
  //     socket.join(roomName);
  //     socket.emit("join-room");
  //     console.log(`Client joined room ${roomName} in namespace ${namespace}`);
  //   } else {
  //     // Room is full, notify the client
  //     socket.emit("room-full");
  //   }
  // });

  // disconnect
  socket.on("disconnect", (reason) => {
    console.log("disconnect : ", reason);
  });
});

/** ==============================
 * LISTEN
 */
httpServer.listen(PORT, () => {
  console.log(`Socket Server is running\nhttp://localhost:${PORT}`);
});
