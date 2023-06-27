import "../../scss/chat/chat.scss";
import "../common/common.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000/", {
  cors: { origin: "*" },
});
socket.on("connect", () => {
  console.log("클라이언트 소캣 통신 성공 >>> ");
});
socket.emit("test-event", "test event", (response) => {
  console.log(response);
});
// socket.on("test-event-send", (data) => {
//   console.log(data);
// });

console.log("CHAT ::: ");
