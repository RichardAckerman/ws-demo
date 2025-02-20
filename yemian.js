import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    // 如果是根路径请求，返回 ws-pure.html
    if (req.url === '/') {
        const filePath = path.join(__dirname, 'ws-pure.html');
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading ws-pure.html');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
    }
});

// 设置服务器监听端口
const PORT = 3000;
server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`服务器运行在 ${url}`);
    // 自动打开浏览器
    open(url);
});
