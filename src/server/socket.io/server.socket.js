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
const returnRoom = (_socket, _roomName) => _socket.adapter.rooms.get(_roomName);

/** ==============================
 * MIDDLEWARE
 */

/** ==============================
 * SOCKET.IO
 */
// io connection
io.on("connection", (socket) => {
  const ROOM_NAME = "AAA";
  const ROOM = returnRoom(socket, ROOM_NAME);

  socket.on("nickname", (_nickname) => {
    socket.nickname = _nickname;
    if (!ROOM) {
      socket.join(ROOM_NAME);
      socket.emit("create-room", {
        nickname: _nickname,
        room: ROOM_NAME,
        size: returnRoom(socket, ROOM_NAME).size,
      });
      console.log(returnRoom(socket, ROOM_NAME));
      console.log(returnRoom(socket, ROOM_NAME).size);
    } else if (ROOM.size === 1) {
      socket.join(ROOM_NAME);
      io.to(ROOM_NAME).emit("join-room", {
        nickname: _nickname,
        room: ROOM_NAME,
        size: returnRoom(socket, ROOM_NAME).size,
      });
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
