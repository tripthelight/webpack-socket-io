export default (_socket) => {
  const CHAT = document.querySelector(".chat");
  const CHAT_INPUT = CHAT.querySelector(".ipt-chat");
  const CHAT_BTN = CHAT.querySelector(".btn-chat");
  const CHAT_SCREEN = CHAT.querySelector(".screen");

  CHAT_BTN.onclick = () => {
    const MSG = CHAT_INPUT.value;
    if (MSG.length < 1) return;
    _socket.emit("send-message", { msg: MSG, nick: window.localStorage.getItem("nickname") });
    CHAT_INPUT.value = "";
    CHAT_INPUT.focus();
  };
};
