import dotenv from "dotenv";
dotenv.config();
import path, { resolve } from "path";
import * as url from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
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
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  mode: "development",
});

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

const MAKE_ROOMS = (_socket, _data) => {
  return new Promise((resolve, reject) => {
    if (_data.roomName) return resolve(false);
    if (io.users) {
      io.users = [...io.users, _socket.id];
    } else {
      io.users = [_socket.id];
    }
    resolve(io.users);
  });
};
const REMOVE_ROOMS = (_socket) => {
  return new Promise((resolve, reject) => {
    if (io.users) {
      const removeUsers = io.users.filter((id) => id !== _socket.id);
      resolve(removeUsers);
    } else {
      resolve([]);
    }
  });
};
const ENTER_ROOM = {
  SAVE_NICKNAME: (_socket, _nickname) => {
    return new Promise((resolve, reject) => {
      _socket.nickname = _nickname;
      resolve(_socket);
    });
  },
  ADD_IO_USERSE: (_socket) => {
    return new Promise((resolve, reject) => {
      if (io.users) {
        // 두번째 입장
        // io에 user 객체가 있음
        io.users = [...io.users, _socket.id];
      } else {
        // 처음 입장
        // io에 user 객체가 없음
        io.users = [_socket.id];
      }
      resolve(_socket);
    });
  },
  SEND_ROOMNAME: (_socket) => {
    return new Promise((resolve, reject) => {
      const ROOMS = io.users;
      let returnRoom = "";

      for (let i = 0; i < ROOMS.length; i++) {
        if (GET_ROOM(_socket, ROOMS[i])) {
          if (GET_ROOM(_socket, ROOMS[i]).size < 2) {
            _socket.join(ROOMS[i]);

            if (_socket.rooms.size === 1) {
              // 1번째로 온사람은 create room
              _socket.emit("create-room", {
                nickname: _socket.nickname,
                room: ROOMS[i],
                size: GET_ROOM(_socket, ROOMS[i]).size,
              });
              returnRoom = ROOMS[i];
            } else if (_socket.rooms.size === 2) {
              // 2번째로 온사람은 join room
              io.to(ROOMS[i]).emit("join-room", {
                nickname: _socket.nickname,
                room: ROOMS[i],
                size: GET_ROOM(_socket, ROOMS[i]).size,
              });
              returnRoom = ROOMS[i];
            }
            break;
          }
        }
      }
      resolve({ _socket, returnRoom });
    });
  },
  EMPTY_ROOMS: (_data) => {
    return new Promise((resolve, reject) => {
      if (GET_ROOM(_data._socket, _data.returnRoom)) {
        if (GET_ROOM(_data._socket, _data.returnRoom).size === 2) {
          io.users = [];
        }
      }
      resolve(_data._socket);
    });
  },
  EMPTY_SAME_ROOMS: (_socket) => {
    return new Promise((resolve, reject) => {
      if (_socket.rooms.size === 2) {
        if (_socket.rooms.has(_socket.id)) {
          _socket.rooms.delete(_socket.id);
        }
      }
      resolve(_socket);
    });
  },
  HIDE_LOADING: (_socket) => {
    _socket.emit("hide-loading");
  },
};

/** ==============================
 * MIDDLEWARE
 */
io.use((socket, next) => {
  next();
});

/** ==============================
 * SOCKET.IO
 */
// io connection
io.on("connection", (socket) => {
  /**
   * client에 진입시 처음 받는 socket event
   * user의 nickname을 받아서 room에 입장시킴
   */
  socket.on("nickname", (_data) => {
    // const ROOMS = await MAKE_ROOMS(socket, _data);
    // if (!ROOMS) return;

    if (_data.roomName) return;

    ENTER_ROOM.SAVE_NICKNAME(socket, _data.nickname) // Promise 실행 -> 받은 닉네임을 socket에 저장
      .then(ENTER_ROOM.ADD_IO_USERSE) // io에 users - socket.id 를 저장
      .then(ENTER_ROOM.SEND_ROOMNAME) // room name을 client에 전달
      .then(ENTER_ROOM.EMPTY_ROOMS) // io.users 제거
      .then(ENTER_ROOM.EMPTY_SAME_ROOMS) // 입장한 방 이외의 socket rooms 제거
      .then(ENTER_ROOM.HIDE_LOADING) // client 화면에서 loading 제거
      .catch(console.error);
  });

  socket.on("send-message", (_data) => {
    // 나의 roomname: [...socket.rooms.keys()].join()
    io.to([...socket.rooms.keys()].join()).emit("receive-message", { msg: _data.msg, nick: socket.nickname });
  });

  // disconnect
  socket.on("disconnect", async (reason) => {
    // socket.to(ROOM_NAME).emit("userLeft", { nick: socket.nickname, size: !ROOM ? 1 : ROOM.size });
    // const ROOMS = await REMOVE_ROOMS(socket);
    // io.users = ROOMS;
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
