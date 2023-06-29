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

const getVisitors = () => {
  // console.log(io.engine.clientsCount);
  // let clients = io.sockets.clients.connected;
  let clients = io.sockets.server.eio.clients;
  let sockets = Object.values(clients);
  let users = sockets.map((s) => s.id);
  return users;
};

const emitVisitors = (socket) => {
  socket.emit("visitors", getVisitors());
};

// namespace: ROOM connection
ROOM.on("connection", (socket) => {
  socket.on("join-room", (roomName, namespace) => {
    const room = ROOM.adapter.rooms.get(roomName);
    if (!room) {
      // Room doesn't exist, create it
      socket.join(roomName);
      socket.emit("roomJoined");
      console.log(`Client joined room ${roomName} in namespace ${namespace}`);
    } else if (room.size < 2) {
      // Room exists but has space, join it
      socket.join(roomName);
      socket.emit("roomJoined");
      console.log(`Client joined room ${roomName} in namespace ${namespace}`);
    } else {
      // Room is full, notify the client
      socket.emit("room-full");
    }
  });

  // disconnect
  socket.on("disconnect", () => {});
});

/** ==============================
 * LISTEN
 */
httpServer.listen(PORT, () => {
  console.log(`Socket Server is running\nhttp://localhost:${PORT}`);
});
