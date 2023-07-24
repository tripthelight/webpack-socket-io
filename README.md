# client와 server와 socket server를 분리함

- socket server는 socket 통신만 담당
- socket server PORT : 4000
- server는 api와 get 요청만 담당
- server PORT : 5000

# 실행순서

- socket: npm run serve:socket
- server: npm run serve:server
- client: npm run build

### NPM INSTALL

- npm i -D @babel/core @babel/preset-env babel-loader
- npm i -D autoprefixer concurrently css-loader
- npm i -D css-minimizer-webpack-plugin dotenv express
- npm i -D html-webpack-plugin mini-css-extract-plugin
- npm i -D nodemon postcss postcss-loader
- npm i -D postcss-preset-env sass sass-loader
- npm i -D style-loader terser-webpack-plugin
- npm i -D webpack webpack-cli
- npm i -D webpack-dev-middleware
- npm i -D webpack-dev-server
- npm i -D socket.io socket.io-client

### TODO

- client에서 새로고침 시 server에 영향 안주도록 할 것
- 트래픽 최소화 고민..
- serve promise 처리가 이해안됨...
