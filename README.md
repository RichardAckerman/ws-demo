# WebSocket 演示项目

这是一个使用 WebSocket 实现的实时通信演示项目，包含了多种实现方案。

## 功能特点

- 纯 WebSocket 实现 (ws-pure.html)
- SharedWorker 实现 (ws-sharedworker.html)
  - 支持自动降级到 localStorage 方案
  - 在不支持 SharedWorker 的环境下仍可使用
- 支持多标签页通信
- 自动重连机制
- 统一配置管理

## 项目结构

```
├── config.js          # 配置文件（ES Module）
├── server.js          # WebSocket 服务器
├── client.js          # 客户端示例代码
├── ws-pure.html      # 纯 WebSocket 实现
├── ws-sharedworker.html  # SharedWorker 实现
├── ws-worker.js      # SharedWorker 实现的 Worker 文件
└── html.js           # 静态文件服务器
```

## 配置说明

### 主要配置文件 (config.js)
- WebSocket 服务器：
  - 主机：localhost
  - 端口：9556

- 静态文件服务器：
  - 主机：localhost
  - 端口：3000
  - 入口页面：通过 `webServer.html` 配置
    - `htmlPage.wsPure`：纯 WebSocket 方案
    - `htmlPage.wsSharedworker`：SharedWorker 方案

### SharedWorker 配置
在 `ws-worker.js` 中，WebSocket 服务器地址被硬编码为：
```javascript
url: 'http://localhost:9556'
```
如需修改 SharedWorker 的连接地址，请直接修改 `ws-worker.js` 文件中的配置。

## 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动服务

1. 启动 WebSocket 服务器：
```bash
node server.js
```

2. 启动静态文件服务器：
```bash
node html.js
```

### 访问演示页面

启动服务后，可以通过以下方式访问演示页面：

1. 通过静态文件服务器访问：
   - 运行 `node html.js` 后会自动在浏览器中打开
   - 默认页面可在 `config.js` 中配置：
     ```javascript
     webServer: {
         // ...
         html: htmlPage.wsPure  // 使用纯 WebSocket 方案
         // 或
         html: htmlPage.wsSharedworker  // 使用 SharedWorker 方案
     }
     ```
   - 手动访问：`http://localhost:3000`

## 调试指南

### SharedWorker 调试方法

1. Chrome 浏览器：
   - 打开 `chrome://inspect/#workers`
   - 在 "Shared workers" 部分找到对应的 worker
   - 点击 "inspect" 打开调试窗口
   - 可以查看 console 日志和调试代码

2. Firefox 浏览器：
   - 打开 `about:debugging#/runtime/this-firefox`
   - 在 "Shared Workers" 部分找到对应的 worker
   - 点击 "Inspect" 打开调试工具

3. 调试技巧：
   - Worker 中的 `console.log` 不会显示在页面的控制台中
   - 需要在专门的 Worker 调试窗口查看日志
   - 可以在 Worker 调试窗口中设置断点
   - 建议开启 "Preserve log" 以保留页面刷新前的日志

### 常见问题排查

1. Worker 连接问题：
   - 检查 Worker 调试窗口中的错误信息
   - 确认 WebSocket 服务器是否正常运行
   - 验证端口号配置是否正确

2. 多标签页通信问题：
   - 使用 Worker 调试窗口确认消息是否正确发送
   - 检查 `ports` 集合中的连接数量
   - 观察广播消息的传递过程

## 注意事项

1. 确保所有端口未被其他程序占用
2. SharedWorker 方案需要浏览器支持 SharedWorker API
3. 使用 ES 模块方式运行，确保您的 Node.js 版本支持 ES 模块
4. 修改 WebSocket 服务器地址时：
   - 普通页面：修改 `config.js`
   - SharedWorker：修改 `ws-worker.js`

5. SharedWorker 调试注意：
   - 每次修改 Worker 代码后需要关闭所有相关标签页
   - 重新打开页面以确保 Worker 代码更新生效
   - 建议同时打开 Worker 调试窗口和页面控制台

## 实现方案说明

### SharedWorker 方案特点
1. 主要实现 (SharedWorker)：
   - 使用单个 WebSocket 连接服务器
   - 通过 SharedWorker 在多个标签页间共享连接
   - 减少服务器连接数，提高性能

2. 降级方案 (localStorage)：
   - 在以下情况自动降级：
     - 浏览器不支持 SharedWorker
     - SharedWorker 初始化失败
     - Worker 运行出错
   - 降级后每个标签页维护独立的 WebSocket 连接
   - 通过 localStorage 实现标签页间通信

3. 动态切换机制：
   - 自动检测环境支持情况
   - 无缝切换到最优方案
   - 保证功能连续性
