# 🐱 猫咪管理系统 - 一键部署指南

> ✅ 免费 | ✅ 无需安装软件 | ✅ 全程网页操作

---

## 📋 部署前准备

你需要准备：
1. 一个 [GitHub](https://github.com) 账号
2. 一个 [Cloudflare](https://dash.cloudflare.com/sign-up) 账号（免费注册）

---

## 第 1 步：Fork 项目

> 把项目复制一份到你自己的 GitHub

1. 打开 👉 [https://github.com/joy-cbo/cat](https://github.com/joy-cbo/cat)
2. 点击右上角的 **Fork** 按钮（分叉图标 ↗️）
3. 点击绿色的 **创建 Fork** 按钮

完成后你的 GitHub 上就有了 `你的用户名/cat` 仓库

---

## 第 2 步：注册 Cloudflare

> 如果已有账号，直接跳到第 3 步

1. 打开 👉 [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. 输入邮箱和密码
3. 点击 **创建账户**
4. 去邮箱点击验证链接

---

## 第 3 步：创建数据库（D1）

1. 打开 👉 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 左侧点击 **存储和数据库**
3. 点击 **D1 SQL 数据库**
4. 点击 **创建数据库**
5. 数据库名称填：`cat-manager-db`
6. 位置选 **中国香港**
7. 点击 **创建数据库**

> ⚠️ 创建后会显示一个 ID，**复制保存好**，等下要用！

---

## 第 4 步：创建文件存储（R2）

1. 左侧点击 **R2 对象存储**
2. 点击 **创建存储桶**
3. 存储桶名称填：`cat-manager-r2`
4. 位置选 **中国香港**
5. 点击 **创建存储桶**

---

## 第 5 步：创建缓存（KV）

1. 左侧点击 **Workers 和 Pages**
2. 点击顶部 **KV** 标签
3. 点击 **创建命名空间**
4. 命名空间名称填：`KV`
5. 点击 **添加**

> ⚠️ 创建后会显示一个 ID，**复制保存好**，等下要用！

---

## 第 6 步：获取账号 ID

1. 回到 Cloudflare 控制台首页
2. 右侧边栏找到 **账户 ID**
3. 点击旁边的 **复制图标**

---

## 第 7 步：创建 API 密钥

1. 打开 👉 [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **创建令牌**
3. 找到 **Cloudflare Pages - 编辑**，点击右侧 **使用模板**
4. 直接点击 **继续到摘要**
5. 点击 **创建令牌**
6. 点击复制令牌

> ⚠️ 令牌只显示一次！**复制保存好**

---

## 第 8 步：生成配置文件

打开 👉 [一键生成配置页面](deploy.html)

把你刚才复制的 ID 填入对应位置，点击生成，然后复制配置内容。

生成的配置文件内容类似：

```toml
name = "cat-manager"
compatibility_date = "2024-09-25"
pages_build_output_dir = ".output/public"

[[d1_databases]]
binding = "DB"
database_name = "cat-manager-db"
database_id = "你复制的D1 ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "cat-manager-r2"

[[kv_namespaces]]
binding = "KV"
id = "你复制的KV ID"

[vars]
JWT_SECRET = "随机生成的密钥"
```

---

## 第 9 步：粘贴配置到 GitHub

1. 打开你的 GitHub 仓库：`https://github.com/你的用户名/cat`
2. 点击文件列表中的 **wrangler.toml** 文件
3. 点击右上角的 **✏️ 铅笔图标**（编辑文件）
4. **全选删除**原有内容，粘贴刚才复制的配置
5. 滚动到底部，点击绿色的 **提交更改** 按钮

---

## 第 10 步：连接 Cloudflare 并部署

1. 回到 Cloudflare 控制台，点击 **Workers 和 Pages**
2. 点击 **创建** 按钮
3. 选择 **Pages** 标签
4. 点击 **连接到 Git**
5. 选择 **GitHub**，授权 Cloudflare 访问你的 GitHub
6. 搜索并选择你的 **cat** 仓库
7. 设置如下，然后点击 **保存并部署**：

| 设置项 | 值 |
|--------|-----|
| 生产分支 | `main` |
| 构建命令 | `npm run build` |
| 构建输出目录 | `.output/public` |

---

## 🎉 部署成功！

你的猫咪管理系统已经上线了！

### 下一步：

1. 在 Cloudflare Pages 找到你的网站地址
2. 打开网站，点击 **注册**
3. 第一个注册的用户自动成为 **管理员**
4. 开始添加你的猫咪吧！🐱

> 💡 以后更新代码，只需在 GitHub 修改并推送，网站会自动更新！

---

## ❓ 常见问题

### 部署失败怎么办？

1. 检查上面填的 ID 是否正确
2. 在 Cloudflare Pages 项目中查看部署日志
3. 确认 GitHub 仓库的 wrangler.toml 内容正确

### 需要花钱吗？

完全免费！Cloudflare 免费套餐：D1 数据库 5GB、R2 存储 10GB、Pages 无限部署。

### 数据会丢失吗？

不会！Cloudflare D1 自动备份数据，非常安全。

### 怎么更新网站？

在 GitHub 修改代码并推送，Cloudflare 会自动重新部署。

### 手机能用吗？

可以！部署后手机浏览器直接访问网址即可使用。
