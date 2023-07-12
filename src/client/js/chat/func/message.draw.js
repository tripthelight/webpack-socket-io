export default (_name, _msg, _state) => {
  const SCREEN = document.querySelector(".screen");
  const DL = document.createElement("dl");
  const DT = document.createElement("dt");
  const DD = document.createElement("dd");

  DT.innerHTML = _name ? _name : "ADMIN";
  DD.innerHTML = _msg ? _msg : "WELCOME";

  DL.appendChild(DT);
  DL.appendChild(DD);

  if (_state) DL.classList.add("user");

  SCREEN.appendChild(DL);

  SCREEN.scrollTo(0, SCREEN.scrollHeight);
};
