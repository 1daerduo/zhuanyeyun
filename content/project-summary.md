# 专业就业通 (zhuanyeyun.com) —— 项目进展总览

> 最后更新: 2026-06-14 10:36
> 项目路径: D:\WorkBuddySpace\2026-06-12-zhuanyeyun\zhuanyeyun
> 线上地址: https://zhuanyeyun.com
> GitHub: github.com/1daerduo/zhuanyeyun

---

## 一、项目概览

面向高考家长和大学生的专业就业数据分析内容站，Next.js 14 SSG + Cloudflare Pages 部署。

## 二、技术栈

- **框架**: Next.js 14 (output: 'export', full SSG)
- **部署**: Cloudflare Pages (GitHub push 自动部署)
- **搜索**: Pagefind 1.5.2 (静态搜索，中文分词)
- **图表**: Chart.js + react-chartjs-2
- **样式**: Tailwind CSS
- **语言**: TypeScript

## 三、页面结构 (~220+ static pages)

| 路由 | 说明 |
|------|------|
| `/` | 首页（搜索+4大排行+专题推荐） |
| `/major/[slug]/` | 189个专业详情页 |
| `/ranking/[category]/` | 13个排行榜（高薪/就业/AI安全/ROI/满意度+8大学科门类） |
| `/tools/compare/` | 专业对比工具 |
| `/tools/salary/` | 薪资计算器 |
| `/guides/` | 专题文章列表 |
| `/guide/[slug]/` | 5篇专题文章详情 |
| `/buy/` | 产品销售页（微信私域成交） |
| `/privacy/`, `/terms/` | 合规页面 |

## 四、变现路径（2026-06-13更新）

### 联盟推广
- 拼多多多多进宝 PID: `44488933_316432727` (已配置)
- 淘宝联盟 PID: `mm_119638500_19524471_72688686` (已配置但需备案审核)
- 京东联盟: 未配置（需备案审核）
- 已挂短链专业: 计算机(2), 软件(1), AI(1), 数据科学(1), 会计(2), 法学(1), 金融(1), 口腔(1)

### 微信私域引流
- 产品销售页 `/buy/` 已上线
- 免费试读版 + ¥49完整版《2026专业报考完整指南》
- 流程: 用户加微信 → 手动收款 → 发PDF
- CTA组件嵌入所有专业详情页和排行榜页
- 需要替换微信二维码和微信号

### 知乎内容引流
- 5篇知乎回答草稿已写完: `content/zhihu-answers.md`
- 覆盖: 计科vs软工/2026推荐专业/AI选报/避坑专业/学校vs专业

## 五、数据规模

- 189个专业覆盖12大学科门类
- 每专业含: 薪资(起薪/3年/5年)、就业率、AI风险评估、院校推荐、FAQ
- 5篇专题深度文章
- 13个排行榜维度

## 六、待办事项

- [ ] 替换微信二维码和微信号 (buy页面 + CTABanner)
- [ ] 知乎发布引流内容
- [ ] 补充拼多多推广短链: 临床医学、电商运营
- [ ] 京东/淘宝联盟备案审批后补充链接
- [ ] 专业数据扩展至300+
- [ ] Pagefind中文分词优化

## 七、环境变量

CF Pages 环境变量:
- NODE_VERSION: 22
- Build command: `npm install && npm run build`
- Build output: `out`
