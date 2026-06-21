# 🐱 猫咪管理系统

一个帮助猫主人全面管理猫咪健康、日常护理和生活记录的 Web 应用。

## 功能特性

- 🐱 猫咪档案管理（品种、年龄、体重、照片）
- 💉 健康记录（疫苗、驱虫、就医、体检）
- ⏰ 提醒系统（疫苗到期、驱虫提醒）
- 📊 数据统计（体重曲线、费用统计）
- 📸 图片上传（猫咪头像、记录附件）
- 📧 邮件提醒（疫苗到期、驱虫提醒）
- 👥 多用户管理（管理员/普通用户）

## 技术栈

- **前端**: Nuxt 3 + Vue 3 + Tailwind CSS
- **后端**: Nitro (Nuxt 内置)
- **数据库**: Cloudflare D1 (本地开发用 SQLite)
- **存储**: Cloudflare R2 (本地开发用文件系统)
- **部署**: Cloudflare Pages

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 部署到 Cloudflare

1. **Fork 仓库到你的 GitHub**

2. **创建 Cloudflare 资源**

```bash
# 安装 wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 D1 数据库
wrangler d1 create cat-manager-db

# 创建 R2 存储桶
wrangler r2 bucket create cat-manager-r2

# 创建 KV 命名空间
wrangler kv namespace create KV
```

3. **更新配置**

将获取的 ID 更新到 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "cat-manager-db"
database_id = "你的D1数据库ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "cat-manager-r2"

[[kv_namespaces]]
binding = "KV"
id = "你的KV命名空间ID"
```

4. **配置 GitHub Secrets**

在 GitHub 仓库设置中添加：
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID
- `RESEND_API_KEY`: Resend API Key (用于邮件通知，可选)

5. **配置邮件服务（可选）**

如果需要邮件提醒功能：

```bash
# 注册 Resend (https://resend.com) 获取 API Key
# 在 Cloudflare Pages 设置中添加环境变量：
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

6. **部署**

推送到 `main` 分支会自动部署。

## 项目结构

```
cat/
├── .github/workflows/    # GitHub Actions
├── pages/               # 页面路由
├── server/              # API 路由
│   ├── api/             # API 端点
│   └── database/        # 数据库 Schema
├── components/          # Vue 组件
├── composables/         # 组合式函数
├── stores/              # Pinia 状态管理
├── assets/              # 静态资源
├── public/              # 公共文件
├── docs/                # 文档
├── wrangler.toml        # Cloudflare 配置
└── nuxt.config.ts       # Nuxt 配置
```

## API 端点

```
POST /api/auth/register     → 注册（首用户自动成为管理员）
POST /api/auth/login        → 登录
POST /api/auth/logout       → 登出
GET  /api/auth/me           → 获取当前用户

GET/POST /api/cats          → 猫咪列表/添加
GET/PUT/DELETE /api/cats/:id → 猫咪详情/更新/删除

GET/POST /api/cats/:id/records → 健康记录
PUT/DELETE /api/records/:id    → 更新/删除记录

GET/POST /api/reminders     → 提醒列表/添加
PUT /api/reminders/:id/complete → 完成提醒
DELETE /api/reminders/:id   → 删除提醒

POST /api/upload            → 图片上传
POST /api/email/test        → 测试邮件发送
GET  /api/stats             → 数据统计
```

## 开发说明

- 首个注册用户自动成为管理员
- 管理员注册后，注册通道自动关闭
- 本地开发使用 SQLite，部署后自动切换到 D1
- 本地开发图片存储在 `public/uploads/`，部署后使用 R2

## License

MIT
