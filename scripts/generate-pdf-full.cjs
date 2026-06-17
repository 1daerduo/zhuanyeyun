/**
 * 完整版 PDF 生成脚本 v3 (Edge Headless)
 * ── 全面升级：30 个字段全量展示 ──
 *
 * 新增展示：description · recommended_for · top_cities
 *   gender_ratio · salary_trend 柱状图 · FAQ · related_majors
 *   roi_grade · tags · course_difficulty · grad_school_necessity
 *   civil_service_fit · transfer_difficulty · top_employers
 *
 * 输出：content/专业报考指南-完整版.pdf
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const EDGE = '"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"';

const ALL_MAJORS = JSON.parse(
  fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'majors.json'), 'utf-8')
);
const MAJORS = ALL_MAJORS;

// ─── 格式化工具 ──────────────────────────────────
const fmtK = (v) => (v != null && !isNaN(v)) ? (v / 1000).toFixed(1) + 'K' : '--';
const fmtPct = (v, d = 1) => (v != null && !isNaN(v)) ? Number(v).toFixed(d) + '%' : '--';
const fmtGrowth = (v5, v0) => {
  if (!v5 || !v0 || v0 === 0) return '--';
  const pct = Math.round(((v5 - v0) / v0) * 100);
  return (pct >= 0 ? '+' : '') + pct + '%';
};
const fmtStar = (v) => '★'.repeat(Math.round(v)) + '☆'.repeat(5 - Math.round(v));
const riskColor = (l) => l === '低' ? '#0d904f' : l === '中' ? '#e67e22' : '#d93025';
const gColor = (g) => g && g.startsWith('+') ? '#0d904f' : g && g.startsWith('-') ? '#d93025' : '#5f6368';

// ─── 目录 ────────────────────────────────────────
function buildTocPages() {
  const perPage = 55;
  const pages = [];
  for (let p = 0; p < Math.ceil(MAJORS.length / perPage); p++) {
    const start = p * perPage, end = Math.min(start + perPage, MAJORS.length);
    const items = MAJORS.slice(start, end).map((m, i) => {
      const pn = 4 + Math.ceil(MAJORS.length / perPage) + 1 + start + i;
      return `<li><span>${start + i + 1}. ${m.name}</span><span class="pn">${pn}</span></li>`;
    }).join('');
    pages.push(`<div class="toc-page wm" data-wm="AGI前哨站 · zhuanyeyun.com">
      <h2>目&emsp;录（${p + 1}/${Math.ceil(MAJORS.length / perPage)}）</h2>
      <ul class="tl">${items}</ul></div>`);
  }
  return pages;
}

// ─── 五年薪资柱状图 ──────────────────────────────
function buildSalaryBars(trend) {
  if (!trend || !Array.isArray(trend) || trend.length === 0) return '';
  const max = Math.max(...trend.map(t => t.salary));
  const bars = trend.map((t, i) => {
    const h = Math.max((t.salary / max) * 100, 8);
    return `<div class="bar-col">
      <div class="bar-fill" style="height:${h}%;background:linear-gradient(180deg,#1e5fd9 0%,#3b82f6 100%)"></div>
      <span class="bar-v">${fmtK(t.salary)}</span>
      <span class="bar-y">Y${i + 1}</span></div>`;
  }).join('');
  return `<div class="salary-chart"><div class="chart-title">📊 五年薪资走势</div><div class="bars">${bars}</div></div>`;
}

// ─── 专业卡片（完整版）────────────────────────────
function buildMajorCard(major, index) {
  const tocPageCount = Math.ceil(MAJORS.length / 55);
  const pageNum = index + 4 + tocPageCount + 1;
  const growth = fmtGrowth(major.salary_5year, major.starting_salary);
  const aiC = riskColor(major.ai_risk_level);
  const grC = gColor(growth);

  return `<div class="mp wm" data-wm="AGI前哨站 · zhuanyeyun.com">
    <!-- 标题行 -->
    <div class="mh">
      <span class="mn">#${index + 1}</span>
      <span class="mname">${major.name}</span>
      <span class="mcat">${major.category} · ${major.degree || ''} · ${major.duration || 4}年</span>
      ${major.roi_grade ? `<span class="roi-badge roi-${major.roi_grade.toLowerCase()}">ROI ${major.roi_grade}</span>` : ''}
    </div>

    <!-- 8 大指标网格 -->
    <div class="kpi-grid">
      <div class="kpi"><div class="kl">起薪</div><div class="kv c-blue">${fmtK(major.starting_salary)}</div></div>
      <div class="kpi"><div class="kl">3年薪资</div><div class="kv c-dark">${fmtK(major.salary_3year)}</div></div>
      <div class="kpi"><div class="kl">5年涨幅</div><div class="kv" style="color:${grC}">${growth}</div></div>
      <div class="kpi"><div class="kl">就业率</div><div class="kv c-orange">${fmtPct(major.employment_rate)}</div></div>
      <div class="kpi"><div class="kl">对口率</div><div class="kv c-gray">${fmtPct(major.relevance_rate)}</div></div>
      <div class="kpi"><div class="kl">满意度</div><div class="kv c-gray">${major.satisfaction != null ? (major.satisfaction / 10).toFixed(1) : '--'} /10</div></div>
      <div class="kpi"><div class="kl">AI风险</div><div class="kv" style="color:${aiC}">${major.ai_risk_level || '--'}</div></div>
      <div class="kpi"><div class="kl">男女比</div><div class="kv c-gray" style="font-size:19px">${major.gender_ratio || '--'}</div></div>
    </div>

    <!-- 五年薪资柱状图 + 专业概述 (双栏) -->
    <div class="dual">
      <div class="dual-l">${buildSalaryBars(major.salary_trend)}</div>
      <div class="dual-r">
        <div class="sec-title">📝 专业概述</div>
        <p class="desc">${major.description ? major.description.slice(0, 200) + (major.description.length > 200 ? '…' : '') : '暂无描述'}</p>
      </div>
    </div>

    <!-- 适合人群 + 课程硬核度 -->
    <div class="info-row">
      <span class="ilabel">✅ 适合人群</span>
      <span class="ival">${major.recommended_for ? major.recommended_for.join(' · ') : '--'}</span>
    </div>
    <div class="info-row">
      <span class="ilabel">📚 课程硬核度</span>
      <span class="ival stars">${major.course_difficulty ? fmtStar(major.course_difficulty) : '--'}</span>
    </div>

    <!-- 岗位 · 行业 · 城市 · 雇主 (双列) -->
    <div class="info-grid">
      <div class="info-row"><span class="ilabel">💼 热门岗位</span><span class="ival">${major.top_positions ? major.top_positions.slice(0, 4).join(' · ') : '--'}</span></div>
      <div class="info-row"><span class="ilabel">🏢 核心行业</span><span class="ival">${major.top_industries ? major.top_industries.slice(0, 3).join(' · ') : '--'}</span></div>
      <div class="info-row"><span class="ilabel">🏙️ 就业城市</span><span class="ival">${major.top_cities ? major.top_cities.join(' · ') : '--'}</span></div>
      <div class="info-row"><span class="ilabel">🎯 头部雇主</span><span class="ival">${major.top_employers ? major.top_employers.slice(0, 4).join(' · ') : '--'}</span></div>
    </div>

    <!-- 院校 -->
    <div class="info-row">
      <span class="ilabel">🏫 对口院校</span>
      <span class="ival">${major.top_schools ? major.top_schools.slice(0, 5).map(s => typeof s === 'object' ? s.name : s).join(' · ') : '--'}</span>
      <span class="note-tip">（各省投档线差异大，分数线请自查）</span>
    </div>

    <!-- 三大决策维度 -->
    <div class="decision-row">
      <div class="dcard"><span class="dd">🎓 考研</span><span class="dv">${major.grad_school_necessity || '--'}</span></div>
      <div class="dcard"><span class="dd">🏛️ 考公</span><span class="dv">${major.civil_service_fit || '--'}</span></div>
      <div class="dcard"><span class="dd">🔄 转专业</span><span class="dv">${major.transfer_difficulty || '--'}</span></div>
    </div>

    <!-- AI 风险详情 -->
    ${major.ai_risk_description ? `<div class="info-row ai-warn"><span class="ilabel">⚠️ AI风险</span><span class="ival">${major.ai_risk_description}</span></div>` : ''}

    <!-- 相关专业 -->
    ${major.related_majors && major.related_majors.length ? `<div class="info-row"><span class="ilabel">🔗 相关专业</span><span class="ival">${major.related_majors.map(s => {
      const rm = ALL_MAJORS.find(m => m.slug === s);
      return rm ? rm.name : s;
    }).join(' · ')}</span></div>` : ''}

    <!-- FAQ -->
    ${major.faq && major.faq.length ? `<div class="faq-section">
      <div class="sec-title">❓ 核心问答</div>${major.faq.slice(0, 2).map(f => `<div class="faq-item"><p class="faq-q">Q: ${f.q}</p><p class="faq-a">A: ${f.a}</p></div>`).join('')}</div>` : ''}

    <!-- 页脚 -->
    <div class="pf"><span>标签：${major.tags ? major.tags.slice(0, 5).join(' · ') : '--'}</span><span>专业就业通 · 第 ${pageNum} 页</span></div>
  </div>`;
}

// ─── 完整 HTML ────────────────────────────────────
function buildHTML() {
  const tocPages = buildTocPages();
  const tocPageCount = Math.ceil(MAJORS.length / 55);
  const majorPages = MAJORS.map((m, i) => buildMajorCard(m, i)).join('\n');
  const totalPages = 1 + tocPageCount + 1 + MAJORS.length + 1;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><style>${CSS}</style></head>
<body>

<!-- 封面 -->
<div class="cover wm wm-dark" data-wm="AGI前哨站 · zhuanyeyun.com">
  <div class="badge">2026 完整版 · ${totalPages} 页</div>
  <h1>专业报考指南</h1>
  <div class="sub">${MAJORS.length} 个专业 · 30 项核心指标</div>
  <div class="feat">
    <span>✅ 薪资趋势 · 就业率 · AI 风险评估 · 院校推荐</span>
    <span>✅ 适合人群 · 课程硬核度 · 考研/考公/转专业建议</span>
    <span>✅ 头部雇主 · 就业城市 · 热门岗位 · 核心行业</span>
    <span>✅ 每个专业 2 条 FAQ · 相似专业对比</span>
  </div>
  <div class="ds">数据来源：教育部公开数据 · 招聘平台大数据 · 国家统计局 · AI 风险分析模型</div>
  <div class="ctab"><span>公众号「AGI前哨站」获取更多资料</span><span>完整版购买 · 微信 swgk44</span></div>
</div>

${tocPages.join('\n')}

<!-- 使用指南 -->
<div class="guide wm" data-wm="AGI前哨站 · zhuanyeyun.com">
  <h2>如何使用这份完整版指南</h2>
  <div class="gc"><h3>📖 完整版包含什么？</h3><p>全部 ${MAJORS.length} 个本科专业的 30 项核心数据：薪资走势、就业率、AI风险评估、考研建议、考公适合度、转专业难度、课程硬核度、适合人群、对口院校、头部雇主、就业城市、核心问答……帮你和孩子一起做出科学的专业选择。</p></div>
  <div class="gc"><h3>💰 薪资数据怎么看？</h3><p>「起薪」是毕业第一年典型月薪，「3年薪资」反映成长速度，「5年涨幅」体现行业红利。注意：高起薪不等于高天花板，要看涨幅！柱状图展示了 5 年薪资增长曲线。</p></div>
  <div class="gc"><h3>🤖 AI 风险评估怎么看？</h3><p>每个专业标注了「低/中/高」三级 AI 替代风险，附评分和详细说明。低风险专业毕业生是 AI 的创造者和使用者，高风险专业需要提前规划差异化竞争力。</p></div>
  <div class="gc"><h3>🎓 考研/考公/转专业建议</h3><p>基于该专业近年毕业生流向和行业要求，给出「本科可就业/建议读研/通常需要读博」三级建议。考公适合度标注了对口公务员岗位的丰富程度。转专业难度评估了万一不适应的退路。</p></div>
  <div class="gc"><h3>⚠️ 关于院校分数线</h3><p>各省投档线差异极大（同一专业不同省份可能差 50-100 分），本指南仅列出对口院校名单。强烈建议结合本省往年投档线数据使用，院校名单仅供参考。</p></div>
</div>

${majorPages}

<!-- CTA 页 -->
<div class="cta-page wm" data-wm="AGI前哨站 · zhuanyeyun.com">
  <h2>找对了方向，努力才有意义</h2>
  <p class="ctaprice">把这 ${totalPages} 页指南分享给需要的家长</p>
  <div class="buy">
    <h3>数据持续更新中 · 一年免费推送</h3>
    <div class="wx">加微信 <strong>swgk44</strong></div>
    <p>备注「完整版」→ 转账 ¥49 → 2 小时内收到 PDF</p>
    <p class="note">或关注公众号「AGI前哨站」回复「完整版」获取最新购买方式</p>
  </div>
  <div class="fn">www.zhuanyeyun.com · 数据更新至 2026 年 6 月 · 购买后一年内数据更新免费推送</div>
</div>

</body></html>`;
}

// ─── CSS ──────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC','Microsoft YaHei','PingFang SC','SimHei',sans-serif;color:#1a1a2e;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

/* ── 封面 ── */
.cover{width:210mm;height:297mm;background:linear-gradient(135deg,#0d3b8c 0%,#1e5fd9 40%,#3b82f6 100%);display:flex;flex-direction:column;justify-content:center;padding:60px;position:relative}
.cover::before,.cover::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(255,255,255,0.12)}
.cover::before{top:42%}.cover::after{top:68%}
.cover .badge{display:inline-block;background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.9);padding:6px 18px;border-radius:20px;font-size:12px;font-weight:500;letter-spacing:2px;margin-bottom:28px;width:fit-content}
.cover h1{font-size:44px;font-weight:900;color:#fff;line-height:1.15;margin-bottom:14px;letter-spacing:2px}
.cover .sub{font-size:22px;font-weight:300;color:rgba(255,255,255,0.85);margin-bottom:36px;letter-spacing:3px}
.cover .feat{display:flex;flex-direction:column;gap:12px;margin-bottom:50px}
.cover .feat span{font-size:14px;color:rgba(255,255,255,0.7);font-weight:300}
.cover .ds{font-size:10px;color:rgba(255,255,255,0.35);margin-top:auto;line-height:1.6}
.cover .ctab{display:flex;gap:20px;margin-top:18px}
.cover .ctab span{font-size:11px;color:rgba(255,255,255,0.75);font-weight:500}
.cover .ctab span:last-child{color:rgba(255,255,255,0.45);font-weight:400}

/* ── 目录 ── */
.toc-page{width:210mm;height:297mm;padding:40px 48px;background:#fff;page-break-after:always}
.toc-page h2{font-size:20px;font-weight:700;color:#1a1a2e;margin-bottom:24px;letter-spacing:2px}
.tl{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 36px}
.tl li{display:flex;justify-content:space-between;padding:5.5px 0;border-bottom:1px dotted #e0e0e0;font-size:11.5px;color:#5f6368}
.tl li .pn{color:#b0b0b0;font-size:10px}

/* ── 使用指南 ── */
.guide{width:210mm;height:297mm;padding:42px 48px;background:#fff;page-break-after:always}
.guide h2{font-size:22px;font-weight:700;color:#1a1a2e;margin-bottom:24px;letter-spacing:2px}
.gc{background:#f8f9fb;border-radius:8px;padding:14px 18px;margin-bottom:12px;border-left:3px solid #1e5fd9}
.gc h3{font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:5px}
.gc p{font-size:11px;color:#5f6368;line-height:1.65}

/* ── 水印 ── */
.wm{position:relative;overflow:hidden}
.wm::after{content:attr(data-wm);position:absolute;top:45%;left:-10%;width:130%;font-size:64px;font-weight:900;color:rgba(0,0,0,0.035);white-space:nowrap;pointer-events:none;z-index:0;transform:rotate(-28deg);letter-spacing:18px;text-align:center}
.wm-dark::after{color:rgba(255,255,255,0.06)}

/* ── 专业卡片 ── */
.mp{width:210mm;min-height:297mm;padding:26px 42px 18px;background:#fff;page-break-after:always}

/* 标题行 */
.mh{display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(90deg,#e8f0fe 0%,#f8f9fb 100%);border-radius:6px;margin-bottom:12px;flex-wrap:wrap}
.mn{font-size:13px;font-weight:900;color:#1e5fd9;min-width:26px}
.mname{font-size:17px;font-weight:700;color:#1a1a2e}
.mcat{font-size:10px;color:#9aa0a6;margin-left:auto}
.roi-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;color:#fff}
.roi-a{background:#0d904f}.roi-b{background:#1e5fd9}.roi-c{background:#e67e22}

/* 8 指标网格 */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.kpi{background:#f8f9fb;border-radius:6px;padding:9px 12px;border:1px solid #e8eaed}
.kl{font-size:8.5px;color:#9aa0a6;font-weight:500;letter-spacing:0.5px;margin-bottom:2px}
.kv{font-size:20px;font-weight:900}.c-blue{color:#1e5fd9}.c-dark{color:#1a1a2e}.c-orange{color:#f4511e}.c-gray{color:#5f6368}

/* 双栏：图表 + 概述 */
.dual{display:flex;gap:14px;margin-bottom:10px}
.dual-l{flex:0 0 200px;background:#f8f9fb;border-radius:6px;padding:10px 14px}
.dual-r{flex:1;background:#f8f9fb;border-radius:6px;padding:10px 14px;overflow:hidden}
.sec-title{font-size:11px;font-weight:700;color:#1a1a2e;margin-bottom:6px}
.desc{font-size:10px;color:#5f6368;line-height:1.6}

/* 薪资柱状图 */
.salary-chart{width:100%}
.chart-title{font-size:10px;font-weight:700;color:#1a1a2e;margin-bottom:6px;text-align:center}
.bars{display:flex;align-items:flex-end;justify-content:space-around;height:80px;gap:10px}
.bar-col{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;flex:1}
.bar-fill{width:100%;max-width:32px;border-radius:3px 3px 0 0;min-height:6px}
.bar-v{font-size:8px;font-weight:700;color:#1a1a2e;margin-top:3px}
.bar-y{font-size:7px;color:#9aa0a6;margin-top:1px}

/* 信息行 */
.info-row{display:flex;align-items:baseline;padding:4px 0;gap:6px;flex-wrap:wrap}
.ilabel{font-size:10px;font-weight:700;color:#1a1a2e;white-space:nowrap;min-width:fit-content}
.ival{font-size:10px;color:#5f6368;line-height:1.55}
.stars{color:#f4a100;font-size:12px;letter-spacing:2px}
.note-tip{font-size:8px;color:#b0b0b0;margin-left:4px}
.ai-warn{background:#fff8e1;border-radius:4px;padding:5px 8px;margin:3px 0}

/* 信息网格 2列 */
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;margin:4px 0}

/* 决策三维度 */
.decision-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}
.dcard{background:#f0f4ff;border-radius:6px;padding:7px 10px}
.dd{font-size:10px;font-weight:700;color:#1a1a2e;display:block;margin-bottom:2px}
.dv{font-size:9.5px;color:#5f6368;line-height:1.5}

/* FAQ */
.faq-section{margin-top:8px;border-top:1px solid #e8eaed;padding-top:8px}
.faq-item{margin-bottom:6px}
.faq-q{font-size:10px;font-weight:700;color:#1a1a2e;margin-bottom:2px}
.faq-a{font-size:9.5px;color:#5f6368;line-height:1.55}

/* 页脚 */
.pf{display:flex;justify-content:space-between;align-items:center;padding-top:10px;margin-top:10px;border-top:1px solid #e8eaed}
.pf span{font-size:8px;color:#b0b0b0}

/* ── CTA 页 ── */
.cta-page{width:210mm;height:297mm;padding:60px 50px;background:#f8f9fb;text-align:center}
.cta-page h2{font-size:28px;font-weight:900;color:#1a1a2e;margin-bottom:8px}
.ctaprice{font-size:16px;font-weight:700;color:#1e5fd9;margin-bottom:28px}
.buy{background:#fff;border-radius:12px;padding:26px 30px;border:2px solid #1e5fd9;max-width:400px;margin:0 auto 36px;text-align:left}
.buy h3{font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:14px}
.buy .wx{font-size:18px;font-weight:500;color:#1a1a2e;margin-bottom:8px}
.buy .wx strong{color:#1e5fd9;font-weight:900;font-size:20px}
.buy p{font-size:12px;color:#5f6368;line-height:1.6}
.buy .note{margin-top:12px;color:#b0b0b0;font-size:11px}
.fn{margin-top:40px;font-size:10px;color:#b0b0b0}

@page{size:A4;margin:0}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

// ─── 主流程 ────────────────────────────────────────
async function main() {
  const tocPageCount = Math.ceil(MAJORS.length / 55);
  const totalPages = 1 + tocPageCount + 1 + MAJORS.length + 1;

  console.log('⏳ 生成完整版 PDF v3（30 项指标）...');
  console.log(`   专业数量: ${MAJORS.length}`);
  console.log(`   目录页数: ${tocPageCount}`);
  console.log(`   预计总页: ${totalPages}`);
  console.log(`   每专业包含: 薪资走势图 · 概述 · 适合人群 · 课程难度`);
  console.log(`              岗位 · 行业 · 城市 · 雇主 · 院校 · FAQ`);
  console.log(`              考研 · 考公 · 转专业 · AI风险 · 相关专业`);
  console.log(`   ⚠️  不含具体分数线（各省差异大，仅列院校名单）`);

  const html = buildHTML();
  const outDir = path.join(PROJECT_ROOT, 'content');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const htmlPath = path.join(outDir, 'full-version-v3.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`   HTML: ${htmlPath}`);
  console.log(`   大小: ${(fs.statSync(htmlPath).size / 1024).toFixed(0)} KB`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const pdfPath = path.join(outDir, `专业报考指南-完整版-v3-${ts}.pdf`);
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/:/g, '%3A');
  const cmd = `${EDGE} --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" --no-margins "${fileUrl}"`;

  console.log('🚀 Edge headless 渲染（244 专业，预计 3-8 分钟）...');
  execSync(cmd, { stdio: 'ignore', timeout: 600000 });
  await new Promise(r => setTimeout(r, 5000));

  if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 50000) {
    const sizeMB = fs.statSync(pdfPath).size / 1024 / 1024;
    console.log(`\n✅ 完整版 PDF v3 生成完成！`);
    console.log(`   输出: ${pdfPath}`);
    console.log(`   大小: ${sizeMB.toFixed(1)} MB`);
    console.log(`   页数: ${totalPages} 页`);
    console.log(`   📊 每专业含 30 项指标（vs 旧版 10 项）`);
  } else {
    console.error('❌ PDF 文件未正确生成（文件过小或不存在）');
  }
}

main().catch(err => { console.error('❌ 失败:', err.message); process.exit(1); });
