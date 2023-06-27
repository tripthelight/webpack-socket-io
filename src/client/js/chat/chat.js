import "../../scss/chat/chat.scss";
import "../common/common.js";
import { v4 as uuidv4 } from "uuid";
import { io, Manager } from "socket.io-client";

const manager = new Manager("ws://localhost:4000");
const roomSocket = manager.socket("/room");

roomSocket.on("connect", () => {});
roomSocket.on("join-room", (data) => {
  console.log(data);
  roomSocket.emit("welcome", "welcome");
});
roomSocket.on("welcome-res", (data) => {
  console.log(data);
});

const CHAT = document.querySelector(".chat");
const CHAT_INPUT = CHAT.querySelector(".ipt-chat");
const CHAT_BTN = CHAT.querySelector(".btn-chat");
const CHAT_SCREEN = CHAT.querySelector(".screen");

CHAT_BTN.onclick = () => {
  const MSG = CHAT_INPUT.value;
  if (MSG.length < 1) return;
};
