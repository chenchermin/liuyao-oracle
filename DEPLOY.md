# 部署说明

## 结论

项目已经按 Vercel 结构改造：

- `public/` 提供前台和后台静态页面。
- `api/` 提供 Vercel Serverless Functions。
- `lib/` 放 AI、鉴权和数据库公共逻辑。
- 线上数据库使用 Neon Postgres。
- 本地没有 `DATABASE_URL` 时回退 SQLite，方便开发测试。

## 必填环境变量

```bash
OPENROUTER_API_KEY=你的 OpenRouter Key
AI_MODEL=nvidia/nemotron-3-super-120b-a12b:free
AI_API_BASE_URL=https://openrouter.ai/api/v1
ADMIN_PASSWORD=你的后台登录密码
ADMIN_SESSION_SECRET=一段随机长字符串
DATABASE_URL=Neon 提供的 Postgres 连接串
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

## Vercel 部署

1. 推送代码到 GitHub。
2. 在 Vercel 导入该 GitHub 仓库。
3. 在 Vercel Marketplace 添加 Neon，拿到 `DATABASE_URL`。
4. 在 Vercel Project Settings 里配置上面的环境变量。
5. 重新部署。

## 数据库

线上使用 Neon Postgres。首次写入或读取时，服务端会自动执行建表 SQL。

本地没有 `DATABASE_URL` 时使用：

```text
data/readings.db
```
