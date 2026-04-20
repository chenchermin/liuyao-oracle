# 部署说明

## 结论

这个项目不能直接部署到 GitHub Pages。

原因：

- GitHub Pages 只能托管静态文件。
- 本项目需要 Node.js 后端调用 AI，不能把 AI 密钥放到浏览器里。
- 本项目需要数据库保存排盘记录。
- 后台记录接口必须在服务端做登录保护。

推荐方式是：

1. 代码托管到 GitHub 仓库。
2. 用 Render、Railway、Fly.io 或支持持久磁盘的 Node.js 平台部署。
3. 配置环境变量。
4. 公开前台地址给别人访问，后台通过密码登录。

## 必填环境变量

```bash
OPENROUTER_API_KEY=你的 OpenRouter Key
AI_MODEL=nvidia/nemotron-3-super-120b-a12b:free
AI_API_BASE_URL=https://openrouter.ai/api/v1
ADMIN_PASSWORD=你的后台登录密码
ADMIN_SESSION_SECRET=一段随机长字符串
```

`ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET` 不能提交到 GitHub，只能放在部署平台的环境变量里。

## 本地运行

复制 `.env.example` 为 `.env`，填入真实配置：

```bash
npm start
```

前台：

```text
http://localhost:3000
```

后台：

```text
http://localhost:3000/admin.html
```

未登录访问后台会跳转到：

```text
http://localhost:3000/admin-login.html
```

## 数据库

当前使用 SQLite：

```text
data/readings.db
```

如果部署到无持久磁盘的平台，SQLite 数据会丢失。线上部署请优先选择支持持久磁盘的平台，或者后续改成 Postgres。
