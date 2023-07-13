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

// let rooms = [];
// let roomName = uuidv4();
let roomName = "";
let rooms = [];

/** ==============================
 * FUNCTIONS
 */
// const COUNT = (_io) => {
//   return new Promise((resolve, reject) => {
//     resolve(_io.engine.clientsCount);
//   });
// };
// const COUNT_FN = async () => {
//   const CNT = await COUNT(io);
//   // console.log(CNT);
//   return CNT;
// };
const GET_ROOM = (_socket, _roomName) => _socket.adapter.rooms.get(_roomName);

/** ==============================
 * MIDDLEWARE
 */
io.use((socket, next) => {
  // COUNT_FN();
  next();
});

/** ==============================
 * SOCKET.IO
 */
// io connection
io.on("connection", (socket) => {
  // const ROOM_NAME = "AAA";
  // const ROOM = GET_ROOM(socket, ROOM_NAME);
  // console.log(COUNT_FN());
  // const COT = await COUNT_FN();
  // console.log(COT);

  socket.on("nickname", (_data) => {
    socket.nickname = _data.nickname;
    console.log(socket.adapter.rooms);
    console.log(GET_ROOM(socket, socket.id));
    rooms.push(socket.id);
    for (let i = 0; i < rooms.length; i++) {
      if (GET_ROOM(socket, rooms[i])) {
        if (GET_ROOM(socket, rooms[i]).size < 2) {
          socket.join(rooms[i]);
          io.to(rooms[i]).emit("join-room", {
            nickname: socket.nickname,
            room: rooms[i],
            size: GET_ROOM(socket, rooms[i]).size,
          });
          return;
        }
      }
    }

    // socket.emit("nickname", socket.nickname);
    // if (!ROOM) {
    //   socket.join(ROOM_NAME);
    //   socket.emit("create-room", {
    //     nickname: _nickname,
    //     room: ROOM_NAME,
    //     size: GET_ROOM(socket, ROOM_NAME).size,
    //   });
    //   // console.log(GET_ROOM(socket, ROOM_NAME));
    //   // console.log(GET_ROOM(socket, ROOM_NAME).size);
    // } else if (ROOM.size === 1) {
    //   socket.join(ROOM_NAME);
    //   io.to(ROOM_NAME).emit("join-room", {
    //     nickname: _nickname,
    //     room: ROOM_NAME,
    //     size: GET_ROOM(socket, ROOM_NAME).size,
    //   });
    // } else {
    //   console.log("AAA room is full !!");
    // }
  });

  // socket.on("roomName", (_roomName) => {
  //   const ROOM = socket.adapter.rooms.get(_roomName);
  // });

  socket.on("send-message", (_data) => {
    // io.to(ROOM_NAME).emit("receive-message", { msg: _data.msg, nick: _data.nick });
  });

  // disconnect
  socket.on("disconnect", (reason) => {
    // COUNT_FN();
    // socket.to(ROOM_NAME).emit("userLeft", { nick: socket.nickname, size: !ROOM ? 1 : ROOM.size });
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
