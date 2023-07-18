const ENTER_ROOM = {
  /**
   * STEP 1 -
   * 내 socket에 nichname 만들기
   * @param {object} _socket : 내 socket
   * @param {string} _nickname : 내 nicketname
   * @returns : 내 socket
   */
  SAVE_NICKNAME: (_socket, _nickname) => {
    return new Promise((resolve, reject) => {
      _socket.nickname = _nickname;
      resolve(_socket);
    });
  },
  /**
   * STEP 2 -
   * namespace에 user 배열 만들기
   * middleware에서 만들었으나 한 번 더 체크
   * namespace 최초 입장일 경우 namespace.user가 없기 때문에 생성
   * namespace 두번째 입장부터는 namespace.user가 있기 때문에
   * 나의 socket.id를 들어온 순서대로 push
   * @param {object} _socket : 내 socket
   * @returns : 내 socket
   */
  ADD_IO_USERSE: (_socket) => {
    return new Promise((resolve, reject) => {
      if (io.users) {
        // namespace에 최초 입장 아님 && (첫번째 입장 | 두번째 입장)
        // io에 user 객체가 있음
        io.users = [...io.users, _socket.id];
      } else {
        // namespace에 최초 입장
        // io에 user 객체가 없음
        io.users = [_socket.id];
      }
      resolve(_socket);
    });
  },
  /**
   * STEP 3 -
   * namespace.user 배열이 있음
   * namespace.users length:
      - 1번째 입장자: 1
      - 2번째 입장자: 2
   * @param {object} _socket : 내 socket
   * @returns : 내 socket, 내가 입장한 room
   */
  SEND_ROOMNAME: (_socket) => {
    return new Promise((resolve, reject) => {
      const ROOMS = io.users;
      const ROOM = io.users[0];

      /**
       * 여기서는 ->
       * io.users의 length:
          - 1번째 입장자: 1
          - 2번째 입장자: 2
       * socket.rooms:
          - 1번째 입장자: 1 개
          - 2번째 입장자: 1 개
       */

      const SEND_ROOM_INFO = (_socket, _room) => {
        return {
          nickname: _socket.nickname,
          room: _room,
          size: GET_ROOM(_socket, _room).size,
        };
      };

      _socket.join(ROOM);
      if (ROOMS.length === 1) {
        // 한 명 입장
        _socket.emit("create-room", SEND_ROOM_INFO(_socket, ROOM));
      } else if (ROOMS.length === 2) {
        // 두 명 입장
        io.to(ROOM).emit("join-room", SEND_ROOM_INFO(_socket, ROOM));
      } else {
        // TODO: client에 res.sendfile롤 404 보낼것
      }

      /**
       * 여기서는 ->
       * io.users의 length:
          - 1번째 입장자: 2
          - 2번째 입장자: 2
       * socket.rooms:
          - 1번째 입장자: 1 개
          - 2번째 입장자: 2 개
       */
      resolve(_socket);
    });
  },
  EMPTY_ROOMS: (_socket) => {
    return new Promise((resolve, reject) => {
      if (_socket.rooms.size === 2) {
        io.users = [];
      }
      resolve(_socket);
    });
  },
  EMPTY_SAME_ROOMS: (_socket) => {
    return new Promise((resolve, reject) => {
      if (_socket.rooms.size === 2) {
        if (_socket.rooms.has(_socket.id)) {
          _socket.rooms.delete(_socket.id);
        }
      }
      resolve(_socket);
    });
  },
  HIDE_LOADING: (_socket) => {
    return new Promise((resolve, reject) => {
      // 방에 입장하면 loading 숨기기
      // 2명 입장한게 아니라 내가 입장한거임
      _socket.emit("hide-loading");
      resolve();
    });
  },
};

/**
 * 실행 :
 */
// await ENTER_ROOM.SAVE_NICKNAME(socket, _data.nickname) // Promise 실행 -> 받은 닉네임을 socket에 저장
//   .then(ENTER_ROOM.ADD_IO_USERSE) // io에 users - socket.id 를 저장
//   .then(ENTER_ROOM.SEND_ROOMNAME) // room name을 client에 전달
//   .then(ENTER_ROOM.EMPTY_ROOMS) // io.users 제거
//   .then(ENTER_ROOM.EMPTY_SAME_ROOMS) // 입장한 방 이외의 socket rooms 제거
//   .then(ENTER_ROOM.HIDE_LOADING) // client 화면에서 loading 제거
//   .catch(console.error); // TODO: client에 res.sendfile롤 404 보낼것
