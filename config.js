const htmlPage = {
    wsPure: 'ws-pure.html',
    wsSharedworker: 'ws-sharedworker.html'
};

export const config = {
    server: {
        host: 'localhost',
        port: 9556,
        wsUrl: function() {
            return `http://${this.host}:${this.port}`;
        }
    },
    webServer: {
        host: 'localhost',
        port: 3000,
        url: function() {
            return `http://${this.host}:${this.port}`;
        },
        html: htmlPage.wsSharedworker
    }
};
