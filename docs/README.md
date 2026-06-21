# 🐱 猫咪管理系统 - 文档

> 版本：v0.3 | 最后更新：2026-06-21

## 目录

- [快速开始](#快速开始)
- [功能模块](#功能模块)
- [API 文档](#api-文档)
- [数据库设计](#数据库设计)
- [部署指南](#部署指南)
- [开发指南](#开发指南)

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账号（部署时需要）

### 本地开发

```bash
# 克隆项目
git clone https://github.com/joy-cbo/cat.git
cd cat

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run db:generate` | 生成数据库迁移文件 |
| `npm run db:migrate` | 执行数据库迁移 |
| `npm run db:studio` | 打开 Drizzle Studio |

---

## 功能模块

### 1. 用户认证

- 注册/登录/登出
- JWT Token 认证（httpOnly cookie）
- 首个注册用户自动成为管理员

### 2. 猫咪档案管理

- 猫咪信息 CRUD（名字、品种、性别、体重等）
- 头像上传
- 多照片管理
- 搜索与筛选

### 3. 健康记录

| 类型 | 说明 |
|------|------|
| vaccine | 疫苗名称、批次号、医院、下次接种日期 |
| deworming | 药品名称、用药剂量 |
| sterilization | 绝育记录 |
| visit | 就诊原因、诊断结果、处方、费用 |
| checkup | 体检项目、结果 |
| weight | 体重记录，用于趋势图 |
| care | 日常护理（刷牙、洗耳等） |

### 4. 提醒系统

- 疫苗到期提醒
- 驱虫提醒
- 体检提醒
- 自定义提醒
- 邮件通知（Resend）

### 5. 数据统计

- 体重曲线
- 费用统计
- 健康概览

---

## API 文档

### 认证相关

#### 注册

```
POST /api/auth/register
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

**响应：**
```json
{
  "user": { "id": 1, "email": "user@example.com", "role": "admin" },
  "token": "jwt_token"
}
```

#### 登录

```
POST /api/auth/login
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 获取当前用户

```
GET /api/auth/me
```

**需要认证**

---

### 猫咪管理

#### 获取猫咪列表

```
GET /api/cats
```

**响应：**
```json
[
  {
    "id": 1,
    "name": "小花",
    "breed": "英短",
    "gender": "female",
    "weight": 4.5,
    "avatar_url": "/uploads/cat1.jpg",
    "status": "active"
  }
]
```

#### 添加猫咪

```
POST /api/cats
```

**请求体：**
```json
{
  "name": "小花",
  "breed": "英短",
  "gender": "female",
  "birthDate": "2023-01-15",
  "weight": 4.5,
  "homeDate": "2023-02-01"
}
```

#### 更新猫咪

```
PUT /api/cats/:id
```

---

### 健康记录

#### 获取猫咪记录

```
GET /api/cats/:id/records
```

#### 添加记录

```
POST /api/cats/:id/records
```

**请求体：**
```json
{
  "type": "vaccine",
  "date": "2026-06-21",
  "vaccineName": "猫三联",
  "batchNumber": "AB123456",
  "hospital": "宠物医院",
  "nextDate": "2027-06-21",
  "notes": "首次接种"
}
```

#### 更新记录

```
PUT /api/records/:id
```

#### 删除记录

```
DELETE /api/records/:id
```

---

### 提醒管理

#### 获取提醒列表

```
GET /api/reminders
```

#### 添加提醒

```
POST /api/reminders
```

**请求体：**
```json
{
  "catId": 1,
  "type": "vaccine",
  "remindAt": "2027-06-21T09:00:00",
  "notes": "疫苗接种提醒"
}
```

#### 完成提醒

```
PUT /api/reminders/:id/complete
```

#### 删除提醒

```
DELETE /api/reminders/:id
```

---

### 文件上传

```
POST /api/upload
```

**请求：** multipart/form-data

**字段：** `file` - 图片文件

**响应：**
```json
{
  "url": "/uploads/image.jpg"
}
```

---

### 数据统计

```
GET /api/stats
```

**响应：**
```json
{
  "totalCats": 3,
  "totalRecords": 25,
  "pendingReminders": 5,
  "weightHistory": [...]
}
```

---

### 邮件测试

```
POST /api/email/test
```

**请求体：**
```json
{
  "to": "user@example.com",
  "catName": "小花",
  "type": "vaccine",
  "remindDate": "2027-06-21",
  "notes": "疫苗接种提醒"
}
```

---

## 数据库设计

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| email | TEXT | 邮箱（唯一） |
| password | TEXT | 密码哈希 |
| name | TEXT | 用户名 |
| role | TEXT | admin/member |
| created_at | DATETIME | 创建时间 |

### cats 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| owner_id | INTEGER | 外键关联 users |
| name | TEXT | 猫咪名字 |
| breed | TEXT | 品种 |
| gender | TEXT | male/female |
| birth_date | DATE | 出生日期 |
| color | TEXT | 颜色 |
| weight | REAL | 体重 |
| avatar_url | TEXT | 头像路径 |
| home_date | DATE | 入家日期 |
| status | TEXT | active/adopted/passed |
| chip_number | TEXT | 芯片号 |
| notes | TEXT | 备注 |
| created_at | DATETIME | 创建时间 |

### health_records 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| cat_id | INTEGER | 外键关联 cats |
| type | TEXT | vaccine/deworming/sterilization/visit/checkup/weight/care |
| date | DATE | 记录日期 |
| vaccine_name | TEXT | 疫苗名称（疫苗类型） |
| batch_number | TEXT | 批次号（疫苗类型） |
| hospital | TEXT | 医院/机构 |
| next_date | DATE | 下次日期 |
| medicine_name | TEXT | 药品名称（驱虫类型） |
| dosage | TEXT | 用药剂量 |
| diagnosis | TEXT | 诊断结果（就医类型） |
| prescription | TEXT | 处方 |
| cost | REAL | 费用 |
| notes | TEXT | 备注 |
| created_at | DATETIME | 创建时间 |

### reminders 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| cat_id | INTEGER | 外键关联 cats |
| type | TEXT | vaccine/deworming/checkup/custom |
| remind_at | DATETIME | 提醒时间 |
| done | INTEGER | 是否完成（0/1） |
| notes | TEXT | 备注 |
| created_at | DATETIME | 创建时间 |

---

## 部署指南

### Cloudflare Pages 部署

#### 1. 创建 Cloudflare 资源

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 D1 数据库
wrangler d1 create cat-manager-db

# 创建 R2 存储桶
wrangler r2 bucket create cat-manager-r2
```

#### 2. 配置 wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "cat-manager-db"
database_id = "你的D1数据库ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "cat-manager-r2"
```

#### 3. 配置 GitHub Secrets

在 GitHub 仓库 Settings > Secrets 中添加：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

#### 4. 自动部署

推送到 `main` 分支会自动触发部署。

---

## 开发指南

### 项目结构

```
cat/
├── pages/              # 页面路由（Nuxt 文件路由）
├── server/
│   ├── api/            # API 路由
│   ├── database/       # 数据库操作
│   └── utils/          # 工具函数
├── components/         # Vue 组件
├── composables/        # 组合式函数
├── stores/             # Pinia 状态管理
├── assets/             # 静态资源
├── public/             # 公共文件
├── docs/               # 文档
├── nuxt.config.ts      # Nuxt 配置
└── wrangler.toml       # Cloudflare 配置
```

### 添加新 API

1. 在 `server/api/` 下创建文件
2. 文件名决定路由（如 `cats.get.ts` → `GET /api/cats`）
3. 导出 `defineEventHandler` 函数

```typescript
export default defineEventHandler(async (event) => {
  // 处理请求
  return { data: '...' }
})
```

### 添加新页面

1. 在 `pages/` 下创建 `.vue` 文件
2. 文件名决定路由（如 `stats.vue` → `/stats`）

### 数据库迁移

```bash
# 修改 server/database/schema.ts 后
npm run db:generate
npm run db:migrate
```

---

## 常见问题

### Q: 本地开发图片上传失败？

A: 确保 `public/uploads/` 目录存在且有写入权限。

### Q: 如何重置数据库？

A: 删除 `local.db` 文件，重启开发服务器。

### Q: 部署后无法访问？

A: 检查 Cloudflare Pages 的构建配置和环境变量。

---

## 相关链接

- [GitHub 仓库](https://github.com/joy-cbo/cat)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Nuxt 3 文档](https://nuxt.com/docs)
- [D1 文档](https://developers.cloudflare.com/d1/)
