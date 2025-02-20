import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIME 类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif'
};

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    // 获取请求的文件路径
    let filePath = req.url === '/' ? config.webServer.html : req.url.substring(1);
    filePath = path.join(__dirname, filePath);

    // 获取文件扩展名
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
            return;
        }

        // 设置正确的 Content-Type 和字符编码
        const charset = extname === '.html' || extname === '.js' ? '; charset=utf-8' : '';
        res.writeHead(200, { 'Content-Type': `${contentType}${charset}` });
        res.end(content);
    });
});

// 设置服务器监听端口
server.listen(config.webServer.port, () => {
    const url = config.webServer.url();
    console.log(`服务器运行在 ${url}`);
    // 自动打开浏览器
    open(url);
});
