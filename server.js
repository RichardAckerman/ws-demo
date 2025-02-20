const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
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
const path = require('path');

app.use('/ws', express.static(path.join(__dirname)));
app.use(express.static('public'));

http.listen(port, () => {
    console.log(`服务器运行在 ws://${host}:${port}`);
});

io.on('connection', (socket) => {
    const id = socket.id;
    console.log('客户端已连接，ID:', id);
    console.log('当前连接数:',io.sockets.sockets.size)

    socket.on('client_data', (data) => {
        const time = new Date().toLocaleString();
        console.log('收到客户端数据--：', data);
        console.log('当前连接数:',io.sockets.sockets.size)
        socket.emit('server_data', `服务端已收到数据: ${time} --- ${data}`);
    });

    socket.on('disconnect', () => {
        // 移除断开连接的客户端
        console.log('客户端断开连接，ID:', socket.id);
        console.log('当前连接数:',io.sockets.sockets.size)
    });
})
