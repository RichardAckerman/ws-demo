const localIP = 'localhost';
// const localIP = '10.0.5.8';

const htmlPage = {
    wsPure: 'ws-pure.html',
    wsSharedworker: 'ws-sharedworker.html'
};

export const config = {
    server: {
        host: localIP,  // 使用本机IP
        port: 9556,
        wsUrl: function() {
            return `http://${this.host}:${this.port}`;
        }
    },
    webServer: {
        host: localIP,  // 使用本机IP
        port: 3000,
        url: function() {
            return `http://${this.host}:${this.port}`;
        },
        html: htmlPage.wsSharedworker
    }
};
