import { io } from 'socket.io-client';
import { config } from './config.js';

const socket = io(config.server.wsUrl(), {
    transports: ['websocket'],  // 只使用 websocket
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

// 接收消息
socket.on("connect", function open() {
    console.log("已连接到服务器，ID:", socket.id);
    socket.emit("client_data", "Hello, server!"); // 向服务器发送消息
});

socket.on("server_data", function incoming(data) {
    console.log("服务端发来的消息：", data); // 打印从服务器接收到的消息
});

socket.on("connect_error", (res) => {
    console.log("connect_error", res); // 打印从服务器接收到的消息
});

socket.on("disconnect", () => {
    console.log("与服务器断开连接");
});

setTimeout(() => {
    socket.emit("client_data", "Hello, server!"); // 向服务器发送消息
}, 1000);

