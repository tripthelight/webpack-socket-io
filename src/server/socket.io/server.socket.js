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
    /**
     * STEP 1
     * 내 socket에 nickname 저장
     */
    socket.nickname = _data.nickname;
    // console.log(socket.adapter.rooms);
    // console.log(GET_ROOM(socket, socket.id));

    /**
     * STEP 2
     * 서버의 rooms 전역 배열에 내 socket.id 저장
     */
    rooms.push(socket.id);

    /**
     * STEP 3
     * 서버의 rooms 전역 배열을 반복
     */
    for (let i = 0; i < rooms.length; i++) {
      /**
       * STEP 4
       * 내가 1번째인지, 2번째인지 모름
       * rooms 전역 배열의 이름을 가진 방이 있는지 검사
       */
      if (GET_ROOM(socket, rooms[i])) {
        /**
         * STEP 5
         * 방이 있고, 그 방의 참여인원이 2명 미만이면,
         */
        if (GET_ROOM(socket, rooms[i]).size < 2) {
          /**
           * STEP 6
           * 2명 미만의 방에 join
           */
          socket.join(rooms[i]);

          /**
           * STEP 7
           * 방에 나 혼자 있으면, create room
           * 방에 먼저온 사람이 있으면, join room
           */
          if (socket.rooms.size === 1) {
            // 1번째로 온사람은 create room
            io.to(rooms[i]).emit("create-room", {
              nickname: socket.nickname,
              room: rooms[i],
              size: GET_ROOM(socket, rooms[i]).size,
            });
          } else if (socket.rooms.size === 2) {
            // 2번째로 온사람은 join room
            io.to(rooms[i]).emit("join-room", {
              nickname: socket.nickname,
              room: rooms[i],
              size: GET_ROOM(socket, rooms[i]).size,
            });
          }

          /**
           * STEP 8
           * 먼저온 사람의 socket.id 명을 가진 방에 2명이 꽉 차면 rooms 배열 비우기
           */
          if (GET_ROOM(socket, rooms[i]).size === 2) {
            // rooms.splice(i, 1);
            rooms = [];
          }

          /**
           * STEP 9
           * 내가 두번째로 온 사람이라서 내 소켓 room의 사이즈가 2가 되면,
           * 내 socket.id 와 동일한 이름의 room을 제거
           */
          if (socket.rooms.size === 2) {
            if (socket.rooms.has(socket.id)) {
              socket.rooms.delete(socket.id);
            }
          }
          console.log(socket.rooms);
          break;
        }
      }
    }
  });

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
