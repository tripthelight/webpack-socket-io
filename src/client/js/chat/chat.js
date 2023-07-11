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
  // console.log("connect >>> ");
  // socket.emit("create-room");
  // socket.emit("user-name", "AAA");
});

socket.on("id", (userID) => {
  console.log("ID :: ", userID);
  // console.log(`joined ${roomName} room!!`);
  // drawBubble("ADMIN", `WELCOME ${roomName}!!`);
});

socket.on("create-room", (roomName) => {
  console.log("room name :: ", roomName);
  // console.log(`joined ${roomName} room!!`);
  // drawBubble("ADMIN", `WELCOME ${roomName}!!`);
});

socket.on("join-room", (roomName) => {
  // console.log("id ::::::::: ", data.id);
  console.log("room name :: ", roomName);
  // console.log(`joined ${roomName} room!!`);
  // drawBubble("ADMIN", `WELCOME ${roomName}!!`);
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

function drawBubble(_name, _msg) {
  const SCREEN = document.querySelector(".screen");
  const DL = document.createElement("dl");
  const DT = document.createElement("dt");
  const DD = document.createElement("dd");

  DT.innerHTML = _name ? _name : "ADMIN";
  DD.innerHTML = _msg ? _msg : "WELCOME";

  DL.appendChild(DT);
  DL.appendChild(DD);

  SCREEN.appendChild(DL);
}
