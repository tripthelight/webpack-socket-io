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

const ENTER_ROOM = async (_socket, _nickname) => {
  _socket.nickname = _nickname;

  if (io.users) {
    io.users = [...io.users, _socket.id];
  } else {
    io.users = [_socket.id];
  }

  const ROOMS = io.users;
  const ROOM = io.users[0];

  const SEND_ROOM_INFO = (_socket, _room) => {
    return {
      nickname: _nickname,
      room: _room,
      size: GET_ROOM(_socket, _room).size,
    };
  };

  _socket.join(ROOM);
  if (ROOMS.length === 1) {
    _socket.emit("create-room", SEND_ROOM_INFO(_socket, ROOM));
  } else if (ROOMS.length === 2) {
    io.to(ROOM).emit("join-room", SEND_ROOM_INFO(_socket, ROOM));
  }

  if (_socket.rooms.size === 2) {
    io.users = [];
    if (_socket.rooms.has(_socket.id)) {
      _socket.rooms.delete(_socket.id);
    }
  }

  _socket.emit("hide-loading");

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
    // const ROOMS = await MAKE_ROOMS(socket, _data);
    // if (!ROOMS) return;

    // client 새로고침 테스트 중
    // if (_data.roomName) return;

    await ENTER_ROOM(socket, _data.nickname);
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
