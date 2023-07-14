export default (_data) => {
  const ROOM_NAME = window.sessionStorage.getItem("roomName");
  if (ROOM_NAME) return;
  window.sessionStorage.setItem("roomName", _data.room);
};
