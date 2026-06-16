/**
 * 生成免费试读版PDF — 15个热门专业
 * 输出: content/专业报考指南-免费试读版.pdf
 */
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

// 选15个热门专业（高搜索量+跨门类覆盖）
const TRIAL_SLUGS = [
  'jisuanji-kexue-yu-jishu',     // 计算机科学与技术
  'ruanjian-gongcheng',           // 软件工程
  'rengong-zhineng',              // 人工智能
  'shuju-kexue-yu-dashuju',       // 数据科学与大数据技术
  'linchuang-yixue',              // 临床医学
  'kouqiang-yixue',               // 口腔医学
  'jinrong-xue',                  // 金融学
  'kuaiji-xue',                   // 会计学
  'fa-xue',                       // 法学
  'dianzi-shangwu',               // 电子商务
  'xinli-xue',                    // 心理学
  'dianqi-gongcheng',             // 电气工程及其自动化
  'hu-li-xue',                    // 护理学
  'ying-yu',                      // 英语
  'tongxin-gongcheng',            // 通信工程
];

const ALL_MAJORS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'majors.json'), 'utf-8')
);

const MAJORS = TRIAL_SLUGS.map(s => ALL_MAJORS.find(m => m.slug === s)).filter(Boolean);

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 50;
const CONTENT_W = PAGE_W - 2 * MARGIN;

// 全局字体引用（在main中赋值）
let FONT, FONT_BOLD, FONT_OBLIQUE;

const COLORS = {
  primary: rgb(0.12, 0.47, 0.91),
  dark: rgb(0.1, 0.1, 0.15),
  medium: rgb(0.4, 0.4, 0.5),
  light: rgb(0.6, 0.6, 0.7),
  accent: rgb(0.96, 0.35, 0.1),
  green: rgb(0.15, 0.65, 0.35),
  red: rgb(0.9, 0.2, 0.2),
  bg: rgb(0.97, 0.97, 0.99),
  white: rgb(1, 1, 1),
  border: rgb(0.85, 0.88, 0.92),
  tagBg: rgb(0.93, 0.96, 1),
};

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  // 嵌入中文字体（Noto Sans SC）
  const fontBytes = fs.readFileSync('C:/Windows/Fonts/NotoSansSC-VF.ttf');
  FONT = await doc.embedFont(fontBytes);

  // 嵌Simsun粗体作为Bold备选，先用同一个中文粗体
  const fontBoldBytes = fs.readFileSync('C:/Windows/Fonts/simsunb.ttf');
  FONT_BOLD = await doc.embedFont(fontBoldBytes);
  FONT_OBLIQUE = FONT; // 中文无斜体，用常规体替代

  // 封面
  drawCover(doc.addPage([PAGE_W, PAGE_H]));

  // 目录
  drawTOC(doc.addPage([PAGE_W, PAGE_H]));

  // 导读
  drawGuide(doc.addPage([PAGE_W, PAGE_H]));

  // 15个专业
  for (let i = 0; i < MAJORS.length; i++) {
    drawMajorPage(doc.addPage([PAGE_W, PAGE_H]), MAJORS[i], i + 1);
  }

  // CTA页
  drawCTAPage(doc.addPage([PAGE_W, PAGE_H]));

  // 保存
  const outDir = path.join(__dirname, '..', 'content');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const pdfBytes = await doc.save();
  const outPath = path.join(outDir, '专业报考指南-免费试读版.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('PDF已生成: ' + outPath);
  console.log('页数: ' + doc.getPageCount() + ' 页');
  console.log('大小: ' + (pdfBytes.length / 1024).toFixed(0) + ' KB');
  console.log('覆盖专业: ' + MAJORS.length + ' 个');
}

function drawCover(page) {
  const { width, height } = page.getSize();
  page.drawRectangle({ x: 0, y: 0, width, height, color: COLORS.primary });
  page.drawRectangle({ x: 0, y: height * 0.35, width, height: 4, color: rgb(1, 1, 1, 0.2) });
  page.drawRectangle({ x: 0, y: height * 0.65, width, height: 4, color: rgb(1, 1, 1, 0.2) });

  page.drawText('2026 专业报考指南', {
    x: 50, y: height - 160, size: 36, font: FONT_BOLD, color: rgb(1, 1, 1),
  });
  page.drawText('免费试读版', {
    x: 50, y: height - 210, size: 28, font: FONT, color: rgb(1, 1, 1, 0.85),
  });

  ['15 个热门专业 · 完整数据解读', '薪资趋势 · 就业率 · AI 风险评估', '给家长和考生的择专业决策参考'].forEach((t, i) => {
    page.drawText(t, { x: 50, y: height - 290 - i * 30, size: 14, font: FONT, color: rgb(1, 1, 1, 0.75) });
  });

  page.drawText('数据来源：教育部公开数据 · 招聘平台大数据 · 国家统计局 · AI 风险模型', {
    x: 50, y: height - 420, size: 9, font: FONT, color: rgb(1, 1, 1, 0.45),
  });
  page.drawText('关注公众号「AI应用铺子」回复「报考指南」免费领取', {
    x: 50, y: 90, size: 11, font: FONT_BOLD, color: rgb(1, 1, 1, 0.9),
  });
  page.drawText('完整版含 244 个专业全量数据  ·  ¥49  ·  加微信 swgk44', {
    x: 50, y: 65, size: 10, font: FONT, color: rgb(1, 1, 1, 0.6),
  });
}

function drawTOC(page) {
  const { height } = page.getSize();
  let y = height - 60;
  page.drawText('目  录', { x: MARGIN, y, size: 24, font: FONT_BOLD, color: COLORS.dark });
  y -= 50;
  page.drawText('如何使用这份指南 .............................. 3', { x: MARGIN, y, size: 12, font: FONT, color: COLORS.medium });
  y -= 26;
  MAJORS.forEach((m, i) => {
    page.drawText(`${m.name} .............................. ${i + 4}`, { x: MARGIN, y, size: 12, font: FONT, color: COLORS.medium });
    y -= 22;
  });
  y -= 10;
  page.drawText('获取完整版指南 .............................. 19', { x: MARGIN, y, size: 12, font: FONT_BOLD, color: COLORS.primary });
}

function drawGuide(page) {
  const { height } = page.getSize();
  let y = height - 60;
  page.drawText('如何使用这份指南', { x: MARGIN, y, size: 20, font: FONT_BOLD, color: COLORS.dark });
  y -= 40;

  const sections = [
    { title: '怎么看薪资数据？', text: '「起薪」是毕业第一年典型月薪范围；「3年薪资」反映成长速度；「5年涨幅」体现行业红利。注意：高起薪不等于高天花板，有些专业起薪一般但5年后翻倍。' },
    { title: 'AI 风险评估怎么看？', text: '每个专业都有 AI 替代风险评分（5-90），越低越安全。评分基于我们自研的「任务可自动化程度」模型，综合考量重复性工作占比、创造性要求、人际互动复杂度。' },
    { title: '专业对口率是什么意思？', text: '毕业后从事本专业相关工作的比例。对口率低不一定是坏事——文科专业对口率普遍低，但毕业生去互联网、体制内的很多。关键是看「就业岗位」列表里有没有你感兴趣的方向。' },
    { title: 'ROI 指数是什么？', text: '自研的「投入产出比」指数（0-100），综合学习难度、就业薪资、行业前景。ROI 高 = 同样努力回报更大，适合「不确定喜欢什么」的学生参考。' },
  ];

  sections.forEach((s) => {
    page.drawText(s.title, { x: MARGIN, y, size: 13, font: FONT_BOLD, color: COLORS.dark });
    y -= 20;
    wrapText(s.text, CONTENT_W - 20, 11).forEach((l) => {
      if (y < 70) return;
      page.drawText(l, { x: MARGIN + 10, y, size: 11, font: FONT, color: COLORS.medium });
      y -= 17;
    });
    y -= 14;
  });
}

function drawMajorPage(page, major, index) {
  const { height } = page.getSize();
  let y = height - 50;
  const x = MARGIN;

  // Header bar
  page.drawRectangle({ x: MARGIN - 5, y: y - 2, width: CONTENT_W + 10, height: 36, color: COLORS.tagBg, borderColor: COLORS.border, borderWidth: 0.5 });
  page.drawText(`#${index}`, { x: x + 5, y: y + 8, size: 14, font: FONT_BOLD, color: COLORS.primary });
  const degInfo = `${major.category}  ·  ${major.degree || '本科'}  ·  ${major.duration || '4年'}`;
  page.drawText(major.name, { x: x + 40, y: y + 8, size: 16, font: FONT_BOLD, color: COLORS.dark });
  page.drawText(degInfo, { x: x + 40 + tw(major.name, 16) + 10, y: y + 10, size: 9, font: FONT, color: COLORS.light });
  y -= 48;

  // 核心数据卡片行1
  metricCard(page, x, y, '月薪', `${major.starting_salary || '-'}K`, '起薪', COLORS.primary);
  metricCard(page, x + 120, y, '3年', `${major.salary_3year || '-'}K`, '薪资', COLORS.dark);
  metricCard(page, x + 240, y, '5年涨幅', `+${major.salary_5year_growth || '--'}%`, '增长', COLORS.green);
  metricCard(page, x + 360, y, '就业率', `${major.employment_rate || '-'}%`, '就业', COLORS.accent);
  y -= 85;

  // 核心数据卡片行2
  metricCard(page, x, y, '对口率', `${major.relevance_rate || '-'}%`, '专业相关', COLORS.medium);
  metricCard(page, x + 120, y, '满意度', `${major.satisfaction || '-'}/10`, '综合满意', COLORS.medium);
  metricCard(page, x + 240, y, 'ROI', `${major.roi_index || '-'}`, '回报指数', COLORS.green);
  const aiColor = major.ai_risk_level === '低' ? COLORS.green : major.ai_risk_level === '中' ? COLORS.accent : COLORS.red;
  metricCard(page, x + 360, y, 'AI风险', major.ai_risk_level || '-', `评分${major.ai_risk_score || '-'}`, aiColor);
  y -= 95;

  // AI 风险描述
  if (major.ai_risk_description) {
    page.drawText('AI 风险评估', { x, y, size: 11, font: FONT_BOLD, color: COLORS.dark });
    y -= 18;
    wrapText(major.ai_risk_description, CONTENT_W - 10, 10).forEach((l) => {
      if (y < 60) return;
      page.drawText(`  ${l}`, { x: x + 10, y, size: 10, font: FONT_OBLIQUE, color: COLORS.medium });
      y -= 16;
    });
    y -= 14;
  }

  // 热门岗位
  if (major.top_positions && major.top_positions.length > 0) {
    page.drawText('热门就业岗位', { x, y, size: 11, font: FONT_BOLD, color: COLORS.dark });
    y -= 22;
    let px = x + 5;
    major.top_positions.slice(0, 4).forEach((p) => {
      const pw = tw(p, 10) + 16;
      if (px + pw > PAGE_W - MARGIN) { px = x + 5; y -= 22; }
      if (y < 50) return;
      page.drawRectangle({ x: px, y: y - 14, width: pw, height: 22, color: COLORS.tagBg, borderColor: COLORS.border, borderWidth: 0.5 });
      page.drawText(p, { x: px + 8, y: y - 9, size: 10, font: FONT, color: COLORS.dark });
      px += pw + 8;
    });
    y -= 40;
  }

  // 核心行业
  if (major.top_industries && major.top_industries.length > 0) {
    page.drawText('核心就业行业', { x, y, size: 11, font: FONT_BOLD, color: COLORS.dark });
    y -= 22;
    wrapText(major.top_industries.join('  ·  '), CONTENT_W - 10, 10).forEach((l) => {
      if (y < 60) return;
      page.drawText(`  ${l}`, { x: x + 5, y, size: 10, font: FONT, color: COLORS.medium });
      y -= 16;
    });
    y -= 14;
  }

  // 就业城市
  if (major.top_cities && major.top_cities.length > 0) {
    page.drawText('主要就业城市', { x, y, size: 11, font: FONT_BOLD, color: COLORS.dark });
    y -= 22;
    wrapText(major.top_cities.join('  ·  '), CONTENT_W - 10, 10).forEach((l) => {
      if (y < 60) return;
      page.drawText(`  ${l}`, { x: x + 5, y, size: 10, font: FONT, color: COLORS.medium });
      y -= 16;
    });
    y -= 14;
  }

  // 推荐院校
  if (major.top_schools && major.top_schools.length > 0) {
    page.drawText('对口院校 TOP3', { x, y, size: 11, font: FONT_BOLD, color: COLORS.dark });
    y -= 22;
    const schools = (typeof major.top_schools[0] === 'object' ? major.top_schools : major.top_schools.map(n => ({ name: n }))).slice(0, 3);
    schools.forEach((s) => {
      if (y < 50) return;
      const name = typeof s === 'object' ? s.name : String(s);
      page.drawText(`  > ${name}`, { x: x + 5, y, size: 10, font: FONT, color: COLORS.medium });
      y -= 18;
    });
    y -= 12;
  }

  // 一句话简介（放页面底部）
  if (major.description) {
    y = Math.min(y, height - 620);
    page.drawText('一句话了解', { x, y, size: 11, font: FONT_BOLD, color: COLORS.dark });
    y -= 20;
    wrapText(major.description, CONTENT_W - 10, 10).forEach((l) => {
      if (y < 40) return;
      page.drawText(l, { x: x + 5, y, size: 10, font: FONT_OBLIQUE, color: COLORS.medium });
      y -= 16;
    });
  }

  // 页脚
  page.drawText(`专业就业通 · zhuanyeyun.com · 第 ${index + 3} 页`, { x: MARGIN, y: 28, size: 8, font: FONT, color: COLORS.light });
  page.drawText('公众号「AI应用铺子」回复「报考指南」免费领取更多', { x: PAGE_W - 340, y: 28, size: 8, font: FONT_BOLD, color: COLORS.primary });
}

function drawCTAPage(page) {
  const { width, height } = page.getSize();
  page.drawRectangle({ x: 0, y: 0, width, height, color: COLORS.bg });

  page.drawText('想要 244 个专业完整数据？', { x: MARGIN, y: height - 120, size: 26, font: FONT_BOLD, color: COLORS.dark });
  page.drawText('《2026 专业报考完整指南》 ¥49', { x: MARGIN, y: height - 165, size: 20, font: FONT_BOLD, color: COLORS.primary });

  let y = height - 220;
  [
    '全部 244 个专业的完整数据（非仅15个试读）',
    '每个专业 5 年薪资趋势详细数据',
    '20+ 所对口院校及参考分数线',
    'AI 替代风险评估（全网独家模型）',
    '专业对比矩阵（同时比 3 个专业）',
    '买后一年内数据更新免费推送',
  ].forEach((f) => {
    page.drawText(`  ${f}`, { x: MARGIN + 20, y, size: 13, font: FONT, color: COLORS.dark });
    y -= 24;
  });

  y -= 35;
  page.drawText('购买方式', { x: MARGIN, y, size: 18, font: FONT_BOLD, color: COLORS.dark });
  y -= 35;
  page.drawText('加微信 swgk44', { x: MARGIN + 20, y, size: 16, font: FONT_BOLD, color: COLORS.primary });
  y -= 24;
  page.drawText('备注「完整版」> 转账 49 元 > 发截图 > 2小时内收到PDF', { x: MARGIN + 20, y, size: 12, font: FONT, color: COLORS.medium });
  y -= 35;
  page.drawText('或关注公众号「AI应用铺子」回复「完整版」', { x: MARGIN + 20, y, size: 12, font: FONT, color: COLORS.medium });

  page.drawText('www.zhuanyeyun.com', { x: MARGIN, y: 40, size: 10, font: FONT, color: COLORS.light });
}

// --- 工具函数 ---
function metricCard(page, x, y, label, value, sublabel, color) {
  const cw = 105, ch = 62;
  page.drawRectangle({ x, y: y - ch, width: cw, height: ch, color: COLORS.white, borderColor: COLORS.border, borderWidth: 0.5 });
  page.drawText(label, { x: x + 8, y: y - 16, size: 8, font: FONT, color: COLORS.light });
  page.drawText(value, { x: x + 8, y: y - 38, size: 20, font: FONT_BOLD, color });
  page.drawText(sublabel, { x: x + 8, y: y - 54, size: 8, font: FONT, color: COLORS.light });
}

function wrapText(text, maxWidth, fontSize) {
  const lines = [];
  let current = '';
  for (const char of text) {
    if (FONT.widthOfTextAtSize(current + char, fontSize) > maxWidth) {
      lines.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function tw(text, fontSize) {
  return FONT_BOLD.widthOfTextAtSize(text, fontSize);
}

main().catch(console.error);
