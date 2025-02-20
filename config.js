// 更改服务器
const serverConfig = {
    localServer: {
        host: 'localhost',
        serverPort: 9556,
        webPort: 3000
    },
    sshServer: {
        host: '10.0.5.8',
        serverPort: 9557,
        webPort: 3000
    }
};

const activeServer = serverConfig.localServer;

const htmlPage = {
    wsPure: 'ws-pure.html',
    wsSharedworker: 'ws-sharedworker.html'
};

export const config = {
    server: {
        host: activeServer.host,
        port: activeServer.serverPort,
        wsUrl: function() {
            return `http://${this.host}:${this.port}`;
        }
    },
    webServer: {
        host: activeServer.host,
        port: activeServer.webPort,
        url: function() {
            return `http://${this.host}:${this.port}`;
        },
        html: htmlPage.wsPure
    }
};
