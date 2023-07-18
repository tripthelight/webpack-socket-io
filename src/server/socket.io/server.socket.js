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

// 메시지를 받을 때 내 room을 찾기
const MY_ROOM = async (_socket) => [..._socket.rooms.keys()].join();

const ENTER_ROOM = async (_socket, _data) => {
  const SEND_ROOM_INFO = (_socket, _room) => {
    return {
      nickname: _data.nickname,
      room: _room,
      size: GET_ROOM(_socket, _room).size,
    };
  };

  if (_data.roomName) {
    // client에서 새로고침 한 경우
    _socket.nickname = _data.nickname;
    _socket.join(_data.roomName);
    io.to(_data.roomName).emit("join-room", SEND_ROOM_INFO(_socket, _data.roomName));
    _socket.emit("hide-loading");
    if (_socket.rooms.has(_socket.id)) {
      _socket.rooms.delete(_socket.id);
    }
  } else {
    // client에서 처음 입장한 경우
    _socket.nickname = _data.nickname;

    if (io.users) {
      io.users = [...io.users, _socket.id];
    } else {
      io.users = [_socket.id];
    }

    const ROOMS = io.users;
    const ROOM = io.users[0];

    _socket.join(ROOM);
    if (ROOMS.length === 1) {
      _socket.emit("create-room", SEND_ROOM_INFO(_socket, ROOM));
    } else if (ROOMS.length === 2) {
      io.to(ROOM).emit("join-room", SEND_ROOM_INFO(_socket, ROOM));
      io.users = [];
    }

    if (_socket.rooms.size === 2) {
      io.users = [];
      if (_socket.rooms.has(_socket.id)) {
        _socket.rooms.delete(_socket.id);
      }
    }

    _socket.emit("hide-loading");
  }

  return;
};

/** ==============================
 * MIDDLEWARE
 */
const NS_FIRST_ENTER = (_io) => {
  return new Promise((resolve, reject) => {
    if (!_io?.users) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

io.use(async (socket, next) => {
  try {
    // namespace에 최초 입장한 사람은 namespace에 users 빈 배열을 만듬
    const USERS = await NS_FIRST_ENTER(io);
    if (USERS) io.users = [];
    next();
  } catch (error) {
    // TODO: client에 res.sendfile롤 404 보낼것
    console.error(error);
  }
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
  socket.on("nickname", async (_data) => {
    await ENTER_ROOM(socket, _data);
  });

  socket.on("send-message", async (_data) => {
    // 나의 roomname: [...socket.rooms.keys()].join()
    const ROOM = await MY_ROOM(socket);
    io.to(ROOM).emit("receive-message", { msg: _data.msg, nick: socket.nickname });
  });

  // disconnecting - 방을 나가기 전: 내 socket.room 을 가지고 있음
  socket.on("disconnecting", async (reason) => {
    // console.log("disconnecting :: ", socket.rooms);
    // socket.to(ROOM_NAME).emit("userLeft", { nick: socket.nickname, size: !ROOM ? 1 : ROOM.size });
    // const ROOMS = await REMOVE_ROOMS(socket);
    // io.users = ROOMS;
  });

  // disconnect - 방을 나간 후: 내 socket.room 이 사라짐
  socket.on("disconnect", async (reason) => {
    // console.log("disconnect :: ", socket.rooms);
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
