const localServer = {
    host: 'localhost',
    port: 9556
}

const sshServer = {
    host: '10.0.5.8',
    port: 9557
}

// 更改服务器
const serverConfig = localServer;

const htmlPage = {
    wsPure: 'ws-pure.html',
    wsSharedworker: 'ws-sharedworker.html'
};

export const config = {
    server: {
        host: serverConfig.host,
        port: serverConfig.port,
        wsUrl: function() {
            return `http://${this.host}:${this.port}`;
        }
    },
    webServer: {
        host: serverConfig.host,
        port: serverConfig.port,
        url: function() {
            return `http://${this.host}:${this.port}`;
        },
        html: htmlPage.wsSharedworker // 默认使用SharedWorker
    }
};
