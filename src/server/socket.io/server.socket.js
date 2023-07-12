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

// let roomsArr = [];
// let roomName = uuidv4();

/** ==============================
 * FUNCTIONS
 */

/** ==============================
 * MIDDLEWARE
 */

/** ==============================
 * SOCKET.IO
 */
// io connection
io.on("connection", (socket) => {
  const ROOM_NAME = "AAA";
  const ROOM = socket.adapter.rooms.get(ROOM_NAME);

  socket.on("nickname", (_nickname) => {
    socket.nickname = _nickname;
    if (!ROOM) {
      console.log("a1 :: ", socket.adapter.rooms);
      socket.join(ROOM_NAME);
      socket.emit("create-room", {
        nickname: _nickname,
        room: ROOM_NAME,
        size: !ROOM ? 1 : ROOM.size,
      });
      console.log("a2 :: ", socket.adapter.rooms);
    } else if (ROOM.size === 1) {
      console.log("b1 :: ", socket.adapter.rooms);
      socket.join(ROOM_NAME);
      io.to(ROOM_NAME).emit("join-room", {
        nickname: _nickname,
        room: ROOM_NAME,
        size: ROOM.size,
      });
      console.log("b2 :: ", socket.adapter.rooms);
    } else {
      console.log("AAA room is full !!");
    }
  });

  // socket.on("roomName", (_roomName) => {
  //   const ROOM = socket.adapter.rooms.get(_roomName);

  // });

  socket.on("send-message", (_data) => {
    io.to(ROOM_NAME).emit("receive-message", { msg: _data.msg, nick: _data.nick });
  });

  // disconnect
  socket.on("disconnect", (reason) => {
    socket.to(ROOM_NAME).emit("userLeft", { nick: socket.nickname, size: !ROOM ? 1 : ROOM.size });
  });
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
