import "../../scss/chat/chat.scss";
import "../common/common.js";
import { v4 as uuidv4 } from "uuid";
import { io, Manager } from "socket.io-client";

const manager = new Manager("ws://localhost:4000");
const ns1Socket = manager.socket("/namespace1");

ns1Socket.on("connect", () => {
  ns1Socket.emit("join-room", "A-1", "A");
});
ns1Socket.on("room-full", () => {
  console.log("The room is full. Cannot join.");
});
ns1Socket.on("join-room", () => {
  console.log("Successfully joined the room");
});

// chat
const CHAT = document.querySelector(".chat");
const CHAT_INPUT = CHAT.querySelector(".ipt-chat");
const CHAT_BTN = CHAT.querySelector(".btn-chat");
const CHAT_SCREEN = CHAT.querySelector(".screen");

CHAT_BTN.onclick = () => {
  const MSG = CHAT_INPUT.value;
  if (MSG.length < 1) return;
};
