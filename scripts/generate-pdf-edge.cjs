/**
 * 试读版 PDF 生成脚本 v3 (Edge Headless)
 * 15 个热门专业 · 30 项核心指标（与完整版同布局）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const EDGE = '"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"';

const TRIAL_SLUGS = [
  'jisuanji-kexue-yu-jishu','ruanjian-gongcheng','rengong-zhineng',
  'shuju-kexue-yu-dashuju','linchuang-yixue','kouqiang-yixue',
  'jinrong-xue','kuaiji-xue','fa-xue','dianzi-shangwu',
  'xinli-xue','dianqi-gongcheng','hu-li-xue','ying-yu','tongxin-gongcheng',
];

const ALL_MAJORS = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'src', 'data', 'majors.json'), 'utf-8'));
const MAJORS = TRIAL_SLUGS.map(s => ALL_MAJORS.find(m => m.slug === s)).filter(Boolean);

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

function buildSalaryBars(trend) {
  if (!trend || !Array.isArray(trend) || trend.length === 0) return '';
  const max = Math.max(...trend.map(t => t.salary));
  const bars = trend.map((t, i) => {
    const h = Math.max((t.salary / max) * 100, 8);
    return `<div class="bar-col"><div class="bar-fill" style="height:${h}%;background:linear-gradient(180deg,#1e5fd9 0%,#3b82f6 100%)"></div><span class="bar-v">${fmtK(t.salary)}</span><span class="bar-y">Y${i+1}</span></div>`;
  }).join('');
  return `<div class="salary-chart"><div class="chart-title">📊 五年薪资走势</div><div class="bars">${bars}</div></div>`;
}

function buildMajorCard(major, index) {
  const pageNum = index + 4;
  const growth = fmtGrowth(major.salary_5year, major.starting_salary);
  const aiC = riskColor(major.ai_risk_level);
  const grC = gColor(growth);

  return `<div class="mp wm" data-wm="AGI前哨站 · 免费试读版">
    <div class="mh">
      <span class="mn">#${index + 1}</span>
      <span class="mname">${major.name}</span>
      <span class="mcat">${major.category} · ${major.degree || ''} · ${major.duration || 4}年</span>
      ${major.roi_grade ? `<span class="roi-badge roi-${major.roi_grade.toLowerCase()}">ROI ${major.roi_grade}</span>` : ''}
    </div>

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

    <div class="dual">
      <div class="dual-l">${buildSalaryBars(major.salary_trend)}</div>
      <div class="dual-r">
        <div class="sec-title">📝 专业概述</div>
        <p class="desc">${major.description ? major.description.slice(0, 200) + (major.description.length > 200 ? '…' : '') : '暂无描述'}</p>
      </div>
    </div>

    <div class="info-row"><span class="ilabel">✅ 适合人群</span><span class="ival">${major.recommended_for ? major.recommended_for.join(' · ') : '--'}</span></div>
    <div class="info-row"><span class="ilabel">📚 课程硬核度</span><span class="ival stars">${major.course_difficulty ? fmtStar(major.course_difficulty) : '--'}</span></div>

    <div class="info-grid">
      <div class="info-row"><span class="ilabel">💼 热门岗位</span><span class="ival">${major.top_positions ? major.top_positions.slice(0,4).join(' · ') : '--'}</span></div>
      <div class="info-row"><span class="ilabel">🏢 核心行业</span><span class="ival">${major.top_industries ? major.top_industries.slice(0,3).join(' · ') : '--'}</span></div>
      <div class="info-row"><span class="ilabel">🏙️ 就业城市</span><span class="ival">${major.top_cities ? major.top_cities.join(' · ') : '--'}</span></div>
      <div class="info-row"><span class="ilabel">🎯 头部雇主</span><span class="ival">${major.top_employers ? major.top_employers.slice(0,4).join(' · ') : '--'}</span></div>
    </div>

    <div class="info-row">
      <span class="ilabel">🏫 对口院校</span>
      <span class="ival">${major.top_schools ? major.top_schools.slice(0,5).map(s => typeof s==='object' ? s.name : s).join(' · ') : '--'}</span>
      <span class="note-tip">（各省投档线差异大，分数线请自查）</span>
    </div>

    <div class="decision-row">
      <div class="dcard"><span class="dd">🎓 考研</span><span class="dv">${major.grad_school_necessity || '--'}</span></div>
      <div class="dcard"><span class="dd">🏛️ 考公</span><span class="dv">${major.civil_service_fit || '--'}</span></div>
      <div class="dcard"><span class="dd">🔄 转专业</span><span class="dv">${major.transfer_difficulty || '--'}</span></div>
    </div>

    ${major.ai_risk_description ? `<div class="info-row ai-warn"><span class="ilabel">⚠️ AI风险</span><span class="ival">${major.ai_risk_description}</span></div>` : ''}

    ${major.related_majors && major.related_majors.length ? `<div class="info-row"><span class="ilabel">🔗 相关专业</span><span class="ival">${major.related_majors.map(s => { const rm = ALL_MAJORS.find(m => m.slug === s); return rm ? rm.name : s; }).join(' · ')}</span></div>` : ''}

    ${major.faq && major.faq.length ? `<div class="faq-section"><div class="sec-title">❓ 核心问答</div>${major.faq.slice(0, 2).map(f => `<div class="faq-item"><p class="faq-q">Q: ${f.q}</p><p class="faq-a">A: ${f.a}</p></div>`).join('')}</div>` : ''}

    <div class="pf"><span>标签：${major.tags ? major.tags.slice(0,5).join(' · ') : '--'}</span><span>专业就业通 · 免费试读版 · 第 ${pageNum} 页</span></div>
  </div>`;
}

function buildHTML() {
  const majorPages = MAJORS.map((m, i) => buildMajorCard(m, i)).join('\n');
  const totalPages = MAJORS.length + 4;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><style>${CSS}</style></head>
<body>

<div class="cover wm wm-dark" data-wm="AGI前哨站 · 免费试读版">
  <div class="badge">2026 最新版 · ${totalPages} 页</div>
  <h1>专业报考指南</h1>
  <div class="sub">免费试读版</div>
  <div class="feat">
    <span>✅ 15 个热门专业 · 30 项核心指标</span>
    <span>✅ 薪资走势 · 适合人群 · 考研/考公建议</span>
    <span>✅ 头部雇主 · 就业城市 · 院校推荐</span>
    <span>✅ 完整版含全部 ${ALL_MAJORS.length} 个专业</span>
  </div>
  <div class="ds">数据来源：教育部公开数据 · 招聘平台大数据 · AI 风险分析模型</div>
  <div class="ctab"><span>公众号「AGI前哨站」免费领取</span><span>完整版 ¥49 · 微信 swgk44</span></div>
</div>

<div class="toc wm" data-wm="AGI前哨站 · 免费试读版">
  <h2>目&emsp;录</h2>
  <ul class="tl">
    <li style="font-weight:500;color:#1a1a2e"><span>如何使用这份指南</span><span class="pn">3</span></li>
    ${MAJORS.map((m,i) => `<li><span>${m.name}</span><span class="pn">${i+4}</span></li>`).join('')}
    <li class="toc-cta"><span>获取完整版（${ALL_MAJORS.length}个专业）</span><span class="pn">${totalPages}</span></li>
  </ul>
</div>

<div class="guide wm" data-wm="AGI前哨站 · 免费试读版">
  <h2>如何使用这份指南</h2>
  <div class="gc"><h3>💰 薪资数据怎么看？</h3><p>「起薪」是毕业第一年典型月薪；「3年薪资」反映成长速度；「5年涨幅」体现行业红利。柱状图展示5年增长曲线，涨幅越陡行业越好。注意：高起薪≠高天花板！</p></div>
  <div class="gc"><h3>🤖 AI 风险评估怎么看？</h3><p>每个专业标注「低/中/高」三级AI替代风险。低风险专业毕业生是AI的创造者和使用者；中风险需要与AI协作；高风险需提前规划差异化竞争力。</p></div>
  <div class="gc"><h3>🎓 考研/考公/转专业怎么用？</h3><p>三个决策维度帮您评估退路：「考研必要性」告诉你这个专业是否必须读研；「考公适合度」标出对口公务员岗位多不多；「转专业难度」评估万一不适应的Plan B。</p></div>
  <div class="gc"><h3>⭐ 课程硬核度是什么？</h3><p>1-5星评分，代表该专业的学习压力和难度。5星=学霸专属（如临床医学），3星=中等偏上，1-2星=课业压力相对较轻。结合孩子各科成绩参考。</p></div>
</div>

${majorPages}

<div class="cta-page wm" data-wm="AGI前哨站 · 免费试读版">
  <h2>试读完 15 个专业，还想看全部 ${ALL_MAJORS.length} 个？</h2>
  <div class="ctaprice">《2026 专业报考完整指南》<strong>¥49</strong></div>
  <ul class="fl">
    <li>全部 ${ALL_MAJORS.length} 个专业完整数据（非仅 15 个试读）</li>
    <li>每个专业 30 项核心指标全覆盖</li>
    <li>5 年薪资走势柱状图（直观对比专业间差异）</li>
    <li>考研/考公/转专业三维度决策建议</li>
    <li>头部雇主 + 就业城市，规划地域和行业方向</li>
    <li>AI 替代风险评估（全网独家）</li>
    <li>购买后一年内数据更新免费推送</li>
  </ul>
  <div class="buy"><h3>购买方式</h3><div class="wx">加微信 <strong>swgk44</strong></div><p>备注「完整版」→ 转账 ¥49 → 发截图 → 2 小时内收到 PDF</p><p class="note">或关注公众号「AGI前哨站」回复「完整版」获取最新购买方式</p></div>
  <div class="fn">www.zhuanyeyun.com · 数据更新至 2026 年 6 月</div>
</div>

</body></html>`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC','Microsoft YaHei','PingFang SC','SimHei',sans-serif;color:#1a1a2e;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

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

.toc{width:210mm;height:297mm;padding:40px 48px;background:#fff;page-break-after:always}
.toc h2{font-size:20px;font-weight:700;color:#1a1a2e;margin-bottom:24px;letter-spacing:2px}
.tl{list-style:none;display:flex;flex-direction:column}
.tl li{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dotted #e0e0e0;font-size:12.5px;color:#5f6368}
.tl li.toc-cta{font-weight:700;color:#1e5fd9;border-bottom:2px solid #1e5fd9}
.tl li .pn{color:#b0b0b0;font-size:10.5px}

.guide{width:210mm;height:297mm;padding:42px 48px;background:#fff;page-break-after:always}
.guide h2{font-size:22px;font-weight:700;color:#1a1a2e;margin-bottom:24px;letter-spacing:2px}
.gc{background:#f8f9fb;border-radius:8px;padding:14px 18px;margin-bottom:12px;border-left:3px solid #1e5fd9}
.gc h3{font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:5px}
.gc p{font-size:11px;color:#5f6368;line-height:1.65}

/* ── 水印 ── */
.wm{position:relative;overflow:hidden}
.wm::after{content:attr(data-wm);position:absolute;top:45%;left:-10%;width:130%;font-size:64px;font-weight:900;color:rgba(0,0,0,0.035);white-space:nowrap;pointer-events:none;z-index:0;transform:rotate(-28deg);letter-spacing:18px;text-align:center}
.wm-dark::after{color:rgba(255,255,255,0.06)}

.mp{width:210mm;min-height:297mm;padding:26px 42px 18px;background:#fff;page-break-after:always}
.mh{display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(90deg,#e8f0fe 0%,#f8f9fb 100%);border-radius:6px;margin-bottom:12px;flex-wrap:wrap}
.mn{font-size:13px;font-weight:900;color:#1e5fd9;min-width:26px}
.mname{font-size:17px;font-weight:700;color:#1a1a2e}
.mcat{font-size:10px;color:#9aa0a6;margin-left:auto}
.roi-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;color:#fff}
.roi-a{background:#0d904f}.roi-b{background:#1e5fd9}.roi-c{background:#e67e22}

.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.kpi{background:#f8f9fb;border-radius:6px;padding:9px 12px;border:1px solid #e8eaed}
.kl{font-size:8.5px;color:#9aa0a6;font-weight:500;letter-spacing:0.5px;margin-bottom:2px}
.kv{font-size:20px;font-weight:900}.c-blue{color:#1e5fd9}.c-dark{color:#1a1a2e}.c-orange{color:#f4511e}.c-gray{color:#5f6368}

.dual{display:flex;gap:14px;margin-bottom:10px}
.dual-l{flex:0 0 200px;background:#f8f9fb;border-radius:6px;padding:10px 14px}
.dual-r{flex:1;background:#f8f9fb;border-radius:6px;padding:10px 14px;overflow:hidden}
.sec-title{font-size:11px;font-weight:700;color:#1a1a2e;margin-bottom:6px}
.desc{font-size:10px;color:#5f6368;line-height:1.6}

.salary-chart{width:100%}
.chart-title{font-size:10px;font-weight:700;color:#1a1a2e;margin-bottom:6px;text-align:center}
.bars{display:flex;align-items:flex-end;justify-content:space-around;height:80px;gap:10px}
.bar-col{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;flex:1}
.bar-fill{width:100%;max-width:32px;border-radius:3px 3px 0 0;min-height:6px}
.bar-v{font-size:8px;font-weight:700;color:#1a1a2e;margin-top:3px}
.bar-y{font-size:7px;color:#9aa0a6;margin-top:1px}

.info-row{display:flex;align-items:baseline;padding:4px 0;gap:6px;flex-wrap:wrap}
.ilabel{font-size:10px;font-weight:700;color:#1a1a2e;white-space:nowrap;min-width:fit-content}
.ival{font-size:10px;color:#5f6368;line-height:1.55}
.stars{color:#f4a100;font-size:12px;letter-spacing:2px}
.note-tip{font-size:8px;color:#b0b0b0;margin-left:4px}
.ai-warn{background:#fff8e1;border-radius:4px;padding:5px 8px;margin:3px 0}

.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;margin:4px 0}

.decision-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}
.dcard{background:#f0f4ff;border-radius:6px;padding:7px 10px}
.dd{font-size:10px;font-weight:700;color:#1a1a2e;display:block;margin-bottom:2px}
.dv{font-size:9.5px;color:#5f6368;line-height:1.5}

.faq-section{margin-top:8px;border-top:1px solid #e8eaed;padding-top:8px}
.faq-item{margin-bottom:6px}
.faq-q{font-size:10px;font-weight:700;color:#1a1a2e;margin-bottom:2px}
.faq-a{font-size:9.5px;color:#5f6368;line-height:1.55}

.pf{display:flex;justify-content:space-between;align-items:center;padding-top:10px;margin-top:10px;border-top:1px solid #e8eaed}
.pf span{font-size:8px;color:#b0b0b0}

.cta-page{width:210mm;height:297mm;padding:50px 48px;background:#f8f9fb}
.cta-page h2{font-size:24px;font-weight:900;color:#1a1a2e;margin-bottom:8px}
.ctaprice{font-size:18px;color:#5f6368;margin-bottom:24px}
.ctaprice strong{color:#1e5fd9;font-size:28px}
.fl{list-style:none;margin-bottom:32px}
.fl li{font-size:12.5px;color:#1a1a2e;padding:6px 0 6px 18px;position:relative}
.fl li::before{content:'✓';position:absolute;left:0;color:#0d904f;font-weight:900;font-size:11px}
.buy{background:#fff;border-radius:12px;padding:22px 28px;border:2px solid #1e5fd9;max-width:380px}
.buy h3{font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:12px}
.buy .wx{font-size:18px;font-weight:500;color:#1a1a2e;margin-bottom:6px}
.buy .wx strong{color:#1e5fd9;font-weight:900;font-size:20px}
.buy p{font-size:12px;color:#5f6368;line-height:1.6}
.buy .note{margin-top:10px;font-size:11px;color:#b0b0b0}
.fn{margin-top:36px;font-size:10px;color:#b0b0b0}

@page{size:A4;margin:0}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

async function main() {
  console.log('⏳ 生成试读版 PDF v3（30 项指标）...');
  console.log(`   专业数量: ${MAJORS.length}`);
  console.log(`   总页数: ${MAJORS.length + 4}`);

  const html = buildHTML();
  const outDir = path.join(PROJECT_ROOT, 'content');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const htmlPath = path.join(outDir, 'trial-v3.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`   HTML: ${htmlPath} (${(fs.statSync(htmlPath).size/1024).toFixed(0)} KB)`);

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const pdfPath = path.join(outDir, `专业报考指南-免费试读版-v3-${ts}.pdf`);
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/:/g, '%3A');
  const cmd = `${EDGE} --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" --no-margins "${fileUrl}"`;

  console.log('🚀 Edge headless 渲染...');
  execSync(cmd, { stdio: 'ignore', timeout: 120000 });
  await new Promise(r => setTimeout(r, 3000));

  if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 10000) {
    const sizeMB = fs.statSync(pdfPath).size / 1024 / 1024;
    console.log(`\n✅ 试读版 PDF v3 生成完成！`);
    console.log(`   输出: ${pdfPath}`);
    console.log(`   大小: ${sizeMB.toFixed(1)} MB`);
    console.log(`   页数: ${MAJORS.length + 4}`);
  } else {
    console.error('❌ PDF 文件未正确生成');
  }
}

main().catch(err => { console.error('❌ 失败:', err.message); process.exit(1); });
