import "../../scss/chat/chat.scss";
import "../common/common.js";
import { io, Manager } from "socket.io-client";

const manager = new Manager("ws://localhost:4000");
const roomSocket = manager.socket("/room");

// const socket = io("http://localhost:5000/room", {
//   cors: { origin: "*" },
// });
roomSocket.on("newRoom", (data) => {
  console.log(data);
});
// socket.on("connect", () => {
//   console.log("클라이언트 소캣 통신 성공 >>> ");
// });
// socket.emit("test-event", "test event", (response) => {
//   console.log(response);
// });
// const response = await socket.emitWithAck("async-send", "async send");
// console.log(response);
