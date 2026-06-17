/**
 * HTML→PDF 高质量生成脚本
 * 使用 Puppeteer 渲染 HTML + CSS → A4 PDF
 * 相比 pdf-lib 手工绘制，CSS 排版质量大幅提升
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PROJECT_ROOT = path.join(__dirname, '..');

// 15 个热门试读专业
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
  fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'majors.json'), 'utf-8')
);

const MAJORS = TRIAL_SLUGS.map(s => ALL_MAJORS.find(m => m.slug === s)).filter(Boolean);

// ─── 数据格式化 ───────────────────────────────────────

function fmtSalary(val) {
  if (val == null || isNaN(val)) return '--';
  if (val >= 10000) return (val / 1000).toFixed(1) + 'K';
  return (val / 1000).toFixed(1) + 'K';
}

function fmtGrowth(v5, v0) {
  if (!v5 || !v0 || v0 === 0) return '--';
  const pct = ((v5 - v0) / v0 * 100).toFixed(0);
  const sign = pct >= 0 ? '+' : '';
  return sign + pct + '%';
}

function fmtNum(val, decimals) {
  if (val == null || isNaN(val)) return '--';
  return val.toFixed(decimals || 0);
}

function fmtSatisfaction(val) {
  if (val == null || isNaN(val)) return '--';
  return (val / 10).toFixed(1) + ' / 10';
}

function aiRiskColor(level) {
  if (level === '低') return 'var(--green)';
  if (level === '中') return 'var(--accent)';
  return 'var(--red)';
}

// ─── HTML 片段生成 ────────────────────────────────────

function buildTOCItems() {
  return MAJORS.map((m, i) => {
    const pageNum = i + 4; // cover=1, toc=2, guide=3
    return `<li><span>${m.name}</span><span class="page-num">${pageNum}</span></li>`;
  }).join('\n');
}

function buildMajorPage(major, index) {
  const pageNum = index + 4; // 封面1 + 目录2 + 导读3 = 第4页开始
  const growth = fmtGrowth(major.salary_5year, major.starting_salary);
  const aiColor = aiRiskColor(major.ai_risk_level);

  let html = `
<div class="major-page">
  <div class="major-header">
    <span class="major-num">#${index + 1}</span>
    <span class="major-name">${major.name}</span>
    <span class="major-meta">${major.category} · ${major.degree || '本科'} · ${major.duration || 4}年</span>
  </div>

  <!-- 核心指标 第 1 行 -->
  <div class="metrics-row">
    <div class="metric-card">
      <div class="mc-label">起薪</div>
      <div class="mc-value" style="color:var(--primary)">${fmtSalary(major.starting_salary)}</div>
      <div class="mc-sublabel">月薪</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">3年薪资</div>
      <div class="mc-value" style="color:var(--dark)">${fmtSalary(major.salary_3year)}</div>
      <div class="mc-sublabel">月薪</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">5年涨幅</div>
      <div class="mc-value" style="color:${growth.startsWith('+') ? 'var(--green)' : 'var(--red)'}">${growth}</div>
      <div class="mc-sublabel">增长率</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">就业率</div>
      <div class="mc-value" style="color:var(--accent)">${fmtNum(major.employment_rate, 1)}%</div>
      <div class="mc-sublabel">毕业当年</div>
    </div>
  </div>

  <!-- 核心指标 第 2 行 -->
  <div class="metrics-row">
    <div class="metric-card">
      <div class="mc-label">对口率</div>
      <div class="mc-value" style="color:var(--medium)">${fmtNum(major.relevance_rate, 1)}%</div>
      <div class="mc-sublabel">专业相关</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">满意度</div>
      <div class="mc-value" style="color:var(--medium)">${fmtSatisfaction(major.satisfaction)}</div>
      <div class="mc-sublabel">综合评分</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">ROI 指数</div>
      <div class="mc-value" style="color:var(--green)">${fmtNum(major.roi_index)}</div>
      <div class="mc-sublabel">回报指数</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">AI 风险</div>
      <div class="mc-value" style="color:${aiColor}">${major.ai_risk_level || '--'}</div>
      <div class="mc-sublabel">评分 ${major.ai_risk_score || '--'}</div>
    </div>
  </div>`;

  // AI 风险描述
  if (major.ai_risk_description) {
    html += `
  <div class="section-block">
    <div class="section-title">AI 风险评估</div>
    <div class="section-content">${major.ai_risk_description}</div>
  </div>`;
  }

  // 热门岗位
  if (major.top_positions && major.top_positions.length > 0) {
    html += `
  <div class="section-block">
    <div class="section-title">热门就业岗位</div>
    <div class="tag-row">
      ${major.top_positions.slice(0, 6).map(p => `<span class="tag">${p}</span>`).join('\n      ')}
    </div>
  </div>`;
  }

  // 核心行业
  if (major.top_industries && major.top_industries.length > 0) {
    html += `
  <div class="section-block">
    <div class="section-title">核心就业行业</div>
    <div class="section-content">${major.top_industries.join(' · ')}</div>
  </div>`;
  }

  // 就业城市
  if (major.top_cities && major.top_cities.length > 0) {
    html += `
  <div class="section-block">
    <div class="section-title">主要就业城市</div>
    <div class="section-content">${major.top_cities.join(' · ')}</div>
  </div>`;
  }

  // 推荐院校
  if (major.top_schools && major.top_schools.length > 0) {
    const schools = major.top_schools.slice(0, 5);
    html += `
  <div class="section-block">
    <div class="section-title">对口院校 TOP5</div>
    <ul class="school-list">
      ${schools.map(s => {
        const name = typeof s === 'object' ? s.name : String(s);
        return `<li>${name}</li>`;
      }).join('\n      ')}
    </ul>
  </div>`;
  }

  // 一句话简介
  if (major.description) {
    html += `
  <div class="section-block">
    <div class="section-title">一句话了解</div>
    <div class="section-content">${major.description}</div>
  </div>`;
  }

  // 页脚
  html += `
  <div class="page-footer">
    <span>专业就业通 · zhuanyeyun.com · 第 ${pageNum} 页</span>
    <span class="footer-cta">公众号「AI应用铺子」回复「报考指南」免费领取更多</span>
  </div>
</div>`;

  return html;
}

// ─── 主流程 ─────────────────────────────────────────

async function main() {
  console.log('⏳ 准备渲染...');
  console.log(`   专业数量: ${MAJORS.length}`);
  console.log(`   总页数: ${MAJORS.length + 4} (含封面/目录/导读/CTA)`);

  // 读取模板
  const templatePath = path.join(__dirname, 'template.html');
  let html = fs.readFileSync(templatePath, 'utf-8');

  // 替换占位符
  html = html.replace('{{TOC_ITEMS}}', buildTOCItems());
  html = html.replace('{{MAJOR_PAGES}}', MAJORS.map((m, i) => buildMajorPage(m, i)).join('\n'));

  // 启动浏览器
  console.log('🚀 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 设置 HTML 内容
  await page.setContent(html, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  // 等待字体加载
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000)); // 额外等待 Google Fonts

  console.log('📄 渲染 PDF...');
  const pdfBytes = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
  });

  await browser.close();

  // 保存
  const outDir = path.join(PROJECT_ROOT, 'content');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, '专业报考指南-免费试读版.pdf');
  fs.writeFileSync(outPath, pdfBytes);

  const sizeKB = (pdfBytes.length / 1024).toFixed(0);
  const sizeMB = (pdfBytes.length / 1024 / 1024).toFixed(1);

  console.log('');
  console.log('✅ PDF 生成完成！');
  console.log(`   输出: ${outPath}`);
  console.log(`   大小: ${sizeKB} KB (${sizeMB} MB)`);
  console.log(`   页数: ${MAJORS.length + 4} 页`);
  console.log(`   覆盖: ${MAJORS.length} 个热门专业`);
  console.log('');
  console.log('💡 相比旧版改进:');
  console.log('   ✓ 新版: HTML+CSS → Puppeteer 渲染 (精美排版)');
  console.log('   ✓ 旧版: pdf-lib 手工绘制 (方块+格式错误)');
  console.log('   ✓ 修复: 薪资 12500 → 12.5K (正确格式化)');
  console.log('   ✓ 修复: 5年涨幅 动态计算自 salary_5year/salary_trend');
  console.log('   ✓ 字体: Google Fonts CDN → Noto Sans SC (无方块)');
}

main().catch(err => {
  console.error('❌ 生成失败:', err.message);
  process.exit(1);
});
