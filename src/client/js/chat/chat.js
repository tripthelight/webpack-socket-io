import "../../scss/chat/chat.scss";
import "../common/common.js";
import { v4 as uuidv4 } from "uuid";
import { io, Manager } from "socket.io-client";

const namespace = "namespace1";
const manager = new Manager("ws://localhost:4000");
const socket = manager.socket("/");
const ns1Socket = manager.socket(`/${namespace}`);
const ROOM_NAME = uuidv4();

socket.on("connect", () => {
  socket.emit("create-room", namespace);
});
socket.on("join-room", (roomName) => {
  console.log("Successfully joined the room :: ", roomName);
  const CHAT_SCREEN = document.querySelector(".screen");
  const DL_EL = document.createElement("dl");
  const DT_EL = document.createElement("dt");
  const DD_EL = document.createElement("dd");

  DT_EL.innerHTML = "ADMIN";
  DD_EL.innerHTML = `Welcome ${roomName}!!`;
  DL_EL.appendChild(DT_EL);
  DL_EL.appendChild(DD_EL);
  CHAT_SCREEN.appendChild(DL_EL);
});
socket.on("room-full", () => {
  console.log("The room is full. Cannot join.");
});

// ns1Socket.on("connect", () => {
//   console.log("connect");
//   ns1Socket.emit("create-room", ROOM_NAME, namespace);
// });
// ns1Socket.on("join-room", (roomName) => {
//   console.log("Successfully joined the room :: ", roomName);
// });
// ns1Socket.on("room-full", () => {
//   console.log("The room is full. Cannot join.");
// });

// ns1Socket.on("room-full", () => {
//   console.log("The room is full. Cannot join.");
// });
// ns1Socket.on("join-room", () => {
//   console.log("Successfully joined the room");
// });

// chat
const CHAT = document.querySelector(".chat");
const CHAT_INPUT = CHAT.querySelector(".ipt-chat");
const CHAT_BTN = CHAT.querySelector(".btn-chat");
const CHAT_SCREEN = CHAT.querySelector(".screen");

CHAT_BTN.onclick = () => {
  const MSG = CHAT_INPUT.value;
  if (MSG.length < 1) return;
};
