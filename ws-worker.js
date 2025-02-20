// 保存所有连接的端口
const ports = new Set();
let socket = null;
let isConnecting = false;
let cleanupInterval = null;

const serverConfig = {
    localServer: {
        host: 'localhost',
        serverPort: 9556,
    },
    sshServer: {
        host: '10.0.5.8',
        serverPort: 9557,
    }
};

const activeServer = serverConfig.sshServer;

// Socket 配置
const SOCKET_CONFIG = {
    url: `http://${activeServer.host}:${activeServer.serverPort}`,
    options: {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    }
};

function initSocket() {
    if (isConnecting || (socket && socket.connected)) return;

    isConnecting = true;
    try {
        cleanupSocket();
        setupNewSocket();
    } catch (error) {
        console.error('初始化 socket 时发生错误:', error);
        isConnecting = false;
    }
}

function cleanupSocket() {
    if (socket) {
        socket.removeAllListeners();
        socket.close();
        socket = null;
    }
}

function setupNewSocket() {
    // 加载 Socket.IO 客户端库
    importScripts('https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/dist/socket.io.min.js');
    
    socket = io(SOCKET_CONFIG.url, SOCKET_CONFIG.options);

    // 设置事件监听器
    socket.on("connect", handleConnect);
    socket.on("server_data", handleServerData);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
}

// Socket 事件处理函数
function handleConnect() {
    console.log('socket 连接成功');
    isConnecting = false;
    broadcast({ type: 'connect', data: socket.id });
    socket.emit("client_data", "Hello, server，我是ws-worker.js!");
}

function handleServerData(data) {
    console.log('收到服务器消息:', data);
    broadcast({ type: 'server_data', data: data });
}

function handleConnectError(error) {
    console.log('连接错误:', error);
    isConnecting = false;
    broadcast({ type: 'connect_error', data: error });
}

function handleDisconnect() {
    console.log('连接断开');
    isConnecting = false;
    broadcast({ type: 'disconnect' });
}

// 广播消息给所有连接的端口
function broadcast(message) {
    const deadPorts = new Set();
    
    ports.forEach(port => {
        try {
            port.postMessage(message);
        } catch (error) {
            console.error('发送消息失败，移除端口:', error);
            deadPorts.add(port);
        }
    });

    // 清理无效端口
    deadPorts.forEach(port => ports.delete(port));
    
    // 如果没有活动端口，清理 socket
    if (ports.size === 0) {
        cleanupSocket();
        stopCleanup();
    }
}

// 清理相关函数
function startCleanup() {
    if (!cleanupInterval) {
        cleanupInterval = setInterval(checkPorts, 30000);
    }
}

function stopCleanup() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
}

function checkPorts() {
    const deadPorts = new Set();
    
    ports.forEach(port => {
        try {
            port.postMessage({ type: 'ping' });
        } catch (error) {
            deadPorts.add(port);
        }
    });

    // 清理无效端口
    deadPorts.forEach(port => ports.delete(port));

    // 如果没有活动端口，清理资源
    if (ports.size === 0) {
        cleanupSocket();
        stopCleanup();
    }
}

// 处理新的连接
self.onconnect = function (e) {
    const port = e.ports[0];
    ports.add(port);
    console.log('新连接已建立，当前连接数:', ports.size);

    // 确保有效连接
    if (!socket || !socket.connected) {
        initSocket();
    }

    // 设置消息处理
    port.onmessage = function (e) {
        const { type, data } = e.data;
        if (type === 'send' && socket && socket.connected) {
            socket.emit("client_data", data);
        }
    };

    port.start();
    startCleanup();
};