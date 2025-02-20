const localServer = {
    host: 'localhost',
    serverPort: 9556,
    webPort: 3000
}

const sshServer = {
    host: '10.0.5.8',
    serverPort: 9557,
    webPort: 3000
}

// 更改服务器
const serverConfig = sshServer;

const htmlPage = {
    wsPure: 'ws-pure.html',
    wsSharedworker: 'ws-sharedworker.html'
};

export const config = {
    server: {
        host: serverConfig.host,
        port: serverConfig.serverPort,
        wsUrl: function() {
            return `http://${this.host}:${this.port}`;
        }
    },
    webServer: {
        host: serverConfig.host,
        port: serverConfig.webPort,
        url: function() {
            return `http://${this.host}:${this.port}`;
        },
        html: htmlPage.wsPure
    }
};
