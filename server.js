import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const http = createServer(app);
const io = new Server(http, {
    path: '/socket.io/',
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    },
    allowEIO3: true,
    transports: ['websocket'],  // 只使用 websocket
    pingTimeout: 60000,
    pingInterval: 25000
});

app.use('/ws', express.static(path.join(__dirname)));
app.use(express.static('public'));

http.listen(config.server.port, () => {
    console.log(`服务器运行在 ws://${config.server.host}:${config.server.port}`);
});

io.on('connection', (socket) => {
    const id = socket.id;
    console.log('客户端已连接，ID:', id);
    console.log('当前连接数:', io.sockets.sockets.size);

    socket.on('client_data', (data) => {
        const time = new Date().toLocaleString();
        console.log('收到客户端数据--：', data);
        console.log('当前连接数:', io.sockets.sockets.size);
        socket.emit('server_data', `服务端已收到数据: ${time} --- ${data}`);
    });

    // 处理私聊消息
    socket.on('private_message', (data) => {
        const time = new Date().toLocaleString();
        console.log('收到私聊消息：', data);
        // 只发送给发送者
        socket.emit('private_message', `${time} --- 来自客户端(${socket.id}): ${data}`);
    });

    // 处理广播消息
    socket.on('broadcast_message', (data) => {
        const time = new Date().toLocaleString();
        console.log('收到广播消息：', data);
        // 广播给所有客户端
        io.emit('broadcast_message', `${time} --- 来自客户端(${socket.id}): ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('客户端断开连接，ID:', socket.id);
        console.log('当前连接数:', io.sockets.sockets.size);
    });
});
