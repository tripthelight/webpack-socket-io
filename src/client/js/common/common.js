/** ===================================================
 * FUNCTIONS
 */

/**
 * sessionStorage 관리: 추가 || 제거
 * @returns : null
 */
const SESSION_STORAGE = {
  // 제거를 위한 object
  remove: {
    // 제거할 storage명을 함수명으로 지정
    roomName: () => {
      // chat 페이지가 아닐 경우 sessionStorage: roomName 제거
      const PATH_NAME = window.location.pathname;
      if (!PATH_NAME) return;
      if (PATH_NAME === "chat") return;
      window.sessionStorage.removeItem("roomName");
    },
  },
};

/** ===================================================
 * DOCUMENT READY
 */
// DOCUMENT READY COMMON
const comnInit = () => {
  SESSION_STORAGE.remove.roomName();
};
const readyComn = () => {
  if (document.readyState === "complete") comnInit();
};
document.onreadystatechange = readyComn;

/** ===================================================
 * WINDOW RESIZE
 */
window.addEventListener("resize", () => {
  // resize
});
