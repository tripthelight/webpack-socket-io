import MAKE_NICK from "./nickname.make.js";

export default () => {
  let nickname = window.localStorage.getItem("nickname");
  if (nickname) return nickname;
  nickname = MAKE_NICK(10);
  window.localStorage.setItem("nickname", nickname);
  return nickname;
};
