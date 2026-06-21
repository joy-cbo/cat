# 🐱 猫咪管理系统 - Cloudflare 一键部署指南

> 专为零基础小白准备，跟着截图一步步操作即可！

---

## 📋 部署前准备

你需要准备：
1. 一个 GitHub 账号
2. 一个 Cloudflare 账号（免费）
3. 一台电脑（Windows/Mac 都可以）

---

## 第一步：Fork 项目到你的 GitHub

### 1.1 打开项目页面

在浏览器打开：https://github.com/joy-cbo/cat

### 1.2 点击 Fork

点击右上角的 **"Fork"** 按钮（就是右上角那个分叉图标）

![Fork 按钮位置：右上角]

### 1.3 确认 Fork

点击绿色的 **"Create fork"** 按钮

完成后，你的 GitHub 上就有了 `你的用户名/cat` 仓库

---

## 第二步：注册 Cloudflare 账号

### 2.1 打开 Cloudflare

在浏览器打开：https://dash.cloudflare.com/sign-up

### 2.2 填写注册信息

- Email：你的邮箱
- Password：设置一个密码
- 点击 **"Create account"**

### 2.3 完成验证

按提示完成邮箱验证

---

## 第三步：在 Cloudflare 创建资源

### 3.1 安装 Wrangler CLI

打开终端（Mac 打开"终端"应用，Windows 打开"PowerShell"）

**Mac 用户运行：**
```bash
# 安装 Homebrew（如果没有的话）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Wrangler
npm install -g wrangler
```

**Windows 用户运行：**
```powershell
npm install -g wrangler
```

### 3.2 登录 Cloudflare

在终端运行：
```bash
wrangler login
```

浏览器会自动打开，点击 **"Allow"** 授权

### 3.3 创建数据库

在终端依次运行以下命令：

```bash
# 创建 D1 数据库
wrangler d1 create cat-manager-db
```

运行后会显示类似：
```
✅ Successfully created DB 'cat-manager-db'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**📝 复制这个 database_id，等下要用！**

```bash
# 创建 R2 存储桶
wrangler r2 bucket create cat-manager-r2
```

```bash
# 创建 KV 命名空间
wrangler kv namespace create KV
```

运行后会显示类似：
```
✅ Successfully created KV namespace 'KV'
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**📝 复制这个 id，等下要用！**

---

## 第四步：获取 Cloudflare 账号信息

### 4.1 获取 Account ID

1. 打开 https://dash.cloudflare.com
2. 点击右侧边栏的 **"Workers & Pages"**
3. 右侧会显示 **"Account ID"**
4. **📝 复制这个 ID！**

### 4.2 获取 API Token

1. 打开 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **"Create Token"**
3. 选择 **"Cloudflare Pages - Edit"** 模板
4. 点击 **"Continue to summary"**
5. 点击 **"Create Token"**
6. **📝 复制这个 Token！（只显示一次）**

---

## 第五步：配置 GitHub Secrets

### 5.1 打开你的仓库设置

1. 打开你的仓库：`https://github.com/你的用户名/cat`
2. 点击 **"Settings"** 标签
3. 左侧点击 **"Secrets and variables"** → **"Actions"**

### 5.2 添加 Secrets

点击 **"New repository secret"**，依次添加：

| Name | Value |
|------|-------|
| `CLOUDFLARE_API_TOKEN` | 你刚才复制的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 你刚才复制的 Account ID |

---

## 第六步：配置数据库 ID

### 6.1 Fork 到本地

```bash
# 克隆你的仓库
git clone https://github.com/你的用户名/cat.git
cd cat
```

### 6.2 修改 wrangler.toml

用文本编辑器打开 `wrangler.toml` 文件，修改以下内容：

```toml
[[d1_databases]]
binding = "DB"
database_name = "cat-manager-db"
database_id = "粘贴你的database_id"  # ← 替换成第三步复制的 ID

[[r2_buckets]]
binding = "R2"
bucket_name = "cat-manager-r2"

[[kv_namespaces]]
binding = "KV"
id = "粘贴你的KV_ID"  # ← 替换成第三步复制的 ID

[vars]
JWT_SECRET = "改成一个复杂的密码"  # ← 改成你自己的密码
```

### 6.3 提交修改

```bash
git add wrangler.toml
git commit -m "配置 Cloudflare 资源 ID"
git push
```

---

## 第七步：自动部署

推送代码后，GitHub Actions 会自动：
1. ✅ 检查代码
2. ✅ 构建项目
3. ✅ 部署到 Cloudflare Pages

### 7.1 查看部署状态

1. 打开你的 GitHub 仓库
2. 点击 **"Actions"** 标签
3. 可以看到正在进行的部署

### 7.2 获取访问地址

部署完成后：

1. 打开 https://dash.cloudflare.com
2. 点击 **"Workers & Pages"**
3. 找到 **"cat-manager"** 项目
4. 点击进入，可以看到你的网站地址！

---

## 第八步：首次访问设置

### 8.1 打开你的网站

点击 Cloudflare 给你的地址（类似 `https://cat-manager.xxx.workers.dev`）

### 8.2 注册管理员

**第一个注册的用户会自动成为管理员！**

1. 点击 **"注册"**
2. 填写邮箱和密码
3. 注册成功后自动登录

---

## 🎉 部署完成！

你现在拥有了自己的猫咪管理系统！

- 🌐 网址：你的 Cloudflare Pages 地址
- 📱 手机也可以访问
- 🔒 数据安全存储在 Cloudflare

---

## ❓ 常见问题

### Q: 部署失败怎么办？

1. 检查 GitHub Secrets 是否正确
2. 检查 wrangler.toml 中的 ID 是否正确
3. 在 Actions 页面查看错误日志

### Q: 如何更新代码？

```bash
# 拉取最新代码
git pull

# 推送到 GitHub
git push
```

推送后会自动重新部署！

### Q: 如何自定义域名？

1. 在 Cloudflare Pages 项目中点击 **"Custom domains"**
2. 添加你的域名
3. 按提示配置 DNS

### Q: 数据会丢失吗？

不会！Cloudflare D1 会自动备份你的数据。

### Q: 需要付费吗？

Cloudflare 免费套餐完全够用：
- D1：免费 5GB 存储
- R2：免费 10GB 存储
- Pages：免费无限部署

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 [Cloudflare 官方文档](https://developers.cloudflare.com/pages/)
2. 在 GitHub 仓库提 Issue
3. 搜索错误信息

---

**恭喜你完成部署！🎉**
