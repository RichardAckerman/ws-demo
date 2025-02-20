import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';

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

const host = 'localhost', port = 9556;

app.use('/ws', express.static(path.join(__dirname)));
app.use(express.static('public'));

http.listen(port, () => {
    console.log(`服务器运行在 ws://${host}:${port}`);
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

    socket.on('disconnect', () => {
        console.log('客户端断开连接，ID:', socket.id);
        console.log('当前连接数:', io.sockets.sockets.size);
    });
});
