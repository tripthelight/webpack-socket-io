import "../../scss/chat/chat.scss";
import "../common/common.js";
import { v4 as uuidv4 } from "uuid";
import { io, Manager } from "socket.io-client";
import pageAccessedByReload from "../../module/client/common/pageAccessedByReload.js";
import SAVE_NICK from "./func/nickname.session.js";
import SAVE_ROOM from "./func/roomname.session.js";
import MSG_DRAW from "./func/message.draw.js";
import MSG_SEND from "./func/message.send.js";
import HIDE_LOAD from "./func/loading.hide.js";

import NICK_MAKE from "./func/nickname.make.js";

const namespace = "namespace1";
const manager = new Manager("ws://localhost:4000");
const socket = manager.socket("/");
const ns1Socket = manager.socket(`/${namespace}`);

// 트레픽 유량제어 테스트
// 트래픽 폭주환경 만들기
// for (let i = 0; i < 1_000; i++) {
//   socket.emit("nickname", {
//     nickname: NICK_MAKE(5),
//   });
// }

socket.on("connect", () => {
  console.log("socket connect >>> ");
  // 새로고침
  // if (pageAccessedByReload) {
  //   console.log("새로고침 함");
  //   HIDE_LOAD();
  // } else {
  //   console.log("새로고침 안함");
  //   socket.emit("nickname", {
  //     nickname: SAVE_NICK(),
  //     roomName: window.sessionStorage.getItem("roomName"),
  //   });
  // }
  socket.emit("nickname", {
    nickname: SAVE_NICK(),
    roomName: window.sessionStorage.getItem("roomName"),
  });
  MSG_SEND(socket);
});

socket.on("create-room", (data) => {
  MSG_DRAW("ADMIN", `Hello <em>${data.nickname}</em>!! Welcome <em>${data.room}</em> room!! 총인원 : ${data.size}`);
  SAVE_ROOM(data);
});

socket.on("join-room", (data) => {
  MSG_DRAW("ADMIN", `<em>${data.nickname}</em> join <em>${data.room}</em> room!! 총인원 : ${data.size}`);
  SAVE_ROOM(data);
});

socket.on("receive-message", (_data) => {
  MSG_DRAW(_data.nick, _data.msg, _data.nick === window.localStorage.nickname ? true : false);
});

socket.on("hide-loading", () => {
  HIDE_LOAD();
});

socket.on("userLeft", (_data) => {
  MSG_DRAW("ADMIN", `<em>${_data.nick}</em> is left room, 총인원 : ${_data.size}`);
});
