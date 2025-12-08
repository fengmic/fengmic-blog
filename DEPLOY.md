# Cloudflare Pages 部署指南

本项目已配置为支持 Cloudflare Pages 静态部署。

## 📋 部署配置

### 构建设置

在 Cloudflare Pages 中设置以下配置：

- **框架预设**: `Next.js (Static HTML Export)`
- **构建命令**: `npm run build`
- **构建输出目录**: `out`
- **Node.js 版本**: `18` (已在 `.node-version` 中配置)

### 环境变量（如需要）

```
NODE_VERSION=18
```

## 🚀 部署步骤

### 方法 1: 通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 页面
3. 点击 **创建项目** > **连接到 Git**
4. 选择你的 GitHub 仓库 `fengmic-blog`
5. 配置构建设置：
   - 构建命令: `npm run build`
   - 构建输出目录: `out`
6. 点击 **保存并部署**

### 方法 2: 通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy out --project-name=fengmic-blog
```

## 📝 配置说明

### next.config.mjs 关键配置

```javascript
{
  output: 'export',           // 静态导出模式
  images: {
    unoptimized: true,        // Cloudflare Pages 需要禁用图片优化
  },
  trailingSlash: true,        // URL 末尾添加斜杠
}
```

### 已优化的功能

- ✅ 静态 HTML 导出
- ✅ 图片自动处理
- ✅ CSS/JS 代码压缩
- ✅ 生产环境移除 console
- ✅ Framer Motion 等库的按需导入

## ⚠️ 注意事项

### 1. 静态导出限制

由于使用 `output: 'export'`，以下 Next.js 功能不可用：
- ❌ Image Optimization（已设置为 unoptimized）
- ❌ Incremental Static Regeneration (ISR)
- ❌ Server-side Rendering (SSR)
- ❌ API Routes

### 2. 动态路由

项目中的动态路由已正确配置：
- `app/post/[id]/page.tsx` - 文章详情页已使用 `generateStaticParams`

### 3. 数据更新

修改 JSON 配置文件后需要：
```bash
# 重新构建并部署
npm run build
git add .
git commit -m "Update content"
git push
```
Cloudflare Pages 会自动触发重新部署。

## 🔧 本地测试静态导出

```bash
# 构建静态文件
npm run build

# 预览静态文件（需要安装 serve）
npx serve@latest out
```

## 📊 性能优化

Cloudflare Pages 自动提供：
- ✅ 全球 CDN 加速
- ✅ HTTP/3 支持
- ✅ 自动 HTTPS
- ✅ Brotli/Gzip 压缩
- ✅ DDoS 防护

## 🌐 自定义域名

1. 在 Cloudflare Pages 项目设置中
2. 点击 **自定义域名**
3. 添加你的域名
4. 按照提示配置 DNS

## 📱 构建状态

构建成功后，你的博客将部署到：
```
https://fengmic-blog.pages.dev
```

或你的自定义域名。

## 🆘 常见问题

### Q: 构建失败？
A: 检查 Node.js 版本是否为 18，确保所有依赖都已安装。

### Q: 图片不显示？
A: 确保外部图片域名已添加到 `next.config.mjs` 的 `remotePatterns` 中。

### Q: 修改内容后没更新？
A: 提交代码到 GitHub，Cloudflare 会自动重新部署。

## 📚 相关文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js Static Export 文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

**Happy Deploying! 🎉**
