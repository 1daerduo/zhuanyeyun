"""
HTML→PDF 高质量生成脚本 (WeasyPrint版)
相比 pdf-lib 手工绘制，CSS 排版质量大幅提升
"""
import json
import sys
import os
from weasyprint import HTML

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ─── 数据 ───────────────────────────────────────────

TRIAL_SLUGS = [
    'jisuanji-kexue-yu-jishu',
    'ruanjian-gongcheng',
    'rengong-zhineng',
    'shuju-kexue-yu-dashuju',
    'linchuang-yixue',
    'kouqiang-yixue',
    'jinrong-xue',
    'kuaiji-xue',
    'fa-xue',
    'dianzi-shangwu',
    'xinli-xue',
    'dianqi-gongcheng',
    'hu-li-xue',
    'ying-yu',
    'tongxin-gongcheng',
]

with open(os.path.join(PROJECT_ROOT, 'src', 'data', 'majors.json'), 'r', encoding='utf-8') as f:
    all_majors = json.load(f)

slug_map = {m['slug']: m for m in all_majors}
majors = [slug_map[s] for s in TRIAL_SLUGS if s in slug_map]

# ─── 格式化 ─────────────────────────────────────────

def fmt_salary(val):
    if val is None or (isinstance(val, float) and val != val):
        return '--'
    try:
        v = float(val)
        if v >= 10000:
            return f'{v/1000:.1f}K'
        return f'{v/1000:.1f}K'
    except:
        return '--'

def fmt_growth(v5, v0):
    try:
        v5, v0 = float(v5), float(v0)
        if v0 == 0:
            return '--'
        pct = round((v5 - v0) / v0 * 100)
        sign = '+' if pct >= 0 else ''
        return f'{sign}{pct}%'
    except:
        return '--'

def fmt_num(val, decimals=0):
    try:
        return f'{float(val):.{decimals}f}'
    except:
        return '--'

def fmt_satisfaction(val):
    try:
        return f'{float(val)/10:.1f} / 10'
    except:
        return '--'

def ai_risk_color(level):
    if level == '低': return '#0d904f'
    if level == '中': return '#f4511e'
    return '#d93025'

def growth_color(g):
    if g.startswith('+'): return '#0d904f'
    if g.startswith('-'): return '#d93025'
    return '#5f6368'

# ─── HTML 片段 ──────────────────────────────────────

def build_toc():
    items = []
    for i, m in enumerate(majors):
        items.append(f'<li><span>{m["name"]}</span><span class="page-num">{i+4}</span></li>')
    return '\n'.join(items)

def build_major_page(major, index):
    page_num = index + 4
    growth = fmt_growth(major.get('salary_5year'), major.get('starting_salary'))
    ai_c = ai_risk_color(major.get('ai_risk_level', ''))
    g_c = growth_color(growth)

    parts = [f'''
<div class="major-page">
  <div class="major-header">
    <span class="major-num">#{index+1}</span>
    <span class="major-name">{major["name"]}</span>
    <span class="major-meta">{major.get("category","")} · {major.get("degree","本科")} · {major.get("duration",4)}年</span>
  </div>

  <div class="metrics-row">
    <div class="metric-card">
      <div class="mc-label">起薪</div>
      <div class="mc-value" style="color:#1e5fd9">{fmt_salary(major.get("starting_salary"))}</div>
      <div class="mc-sublabel">月薪</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">3年薪资</div>
      <div class="mc-value" style="color:#1a1a2e">{fmt_salary(major.get("salary_3year"))}</div>
      <div class="mc-sublabel">月薪</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">5年涨幅</div>
      <div class="mc-value" style="color:{g_c}">{growth}</div>
      <div class="mc-sublabel">增长率</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">就业率</div>
      <div class="mc-value" style="color:#f4511e">{fmt_num(major.get("employment_rate"),1)}%</div>
      <div class="mc-sublabel">毕业当年</div>
    </div>
  </div>

  <div class="metrics-row">
    <div class="metric-card">
      <div class="mc-label">对口率</div>
      <div class="mc-value" style="color:#5f6368">{fmt_num(major.get("relevance_rate"),1)}%</div>
      <div class="mc-sublabel">专业相关</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">满意度</div>
      <div class="mc-value" style="color:#5f6368">{fmt_satisfaction(major.get("satisfaction"))}</div>
      <div class="mc-sublabel">综合评分</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">ROI 指数</div>
      <div class="mc-value" style="color:#0d904f">{fmt_num(major.get("roi_index"))}</div>
      <div class="mc-sublabel">回报指数</div>
    </div>
    <div class="metric-card">
      <div class="mc-label">AI 风险</div>
      <div class="mc-value" style="color:{ai_c}">{major.get("ai_risk_level","--")}</div>
      <div class="mc-sublabel">评分 {major.get("ai_risk_score","--")}</div>
    </div>
  </div>''']

    desc = major.get('ai_risk_description', '')
    if desc:
        parts.append(f'''
  <div class="section-block">
    <div class="section-title">AI 风险评估</div>
    <div class="section-content">{desc}</div>
  </div>''')

    positions = major.get('top_positions', [])
    if positions:
        tags = '\n      '.join(f'<span class="tag">{p}</span>' for p in positions[:6])
        parts.append(f'''
  <div class="section-block">
    <div class="section-title">热门就业岗位</div>
    <div class="tag-row">
      {tags}
    </div>
  </div>''')

    industries = major.get('top_industries', [])
    if industries:
        parts.append(f'''
  <div class="section-block">
    <div class="section-title">核心就业行业</div>
    <div class="section-content">{' · '.join(industries)}</div>
  </div>''')

    cities = major.get('top_cities', [])
    if cities:
        parts.append(f'''
  <div class="section-block">
    <div class="section-title">主要就业城市</div>
    <div class="section-content">{' · '.join(cities)}</div>
  </div>''')

    schools = major.get('top_schools', [])
    if schools:
        school_li = '\n      '.join(
            f'<li>{s["name"] if isinstance(s, dict) else s}</li>'
            for s in schools[:5]
        )
        parts.append(f'''
  <div class="section-block">
    <div class="section-title">对口院校 TOP5</div>
    <ul class="school-list">
      {school_li}
    </ul>
  </div>''')

    desc_text = major.get('description', '')
    if desc_text:
        parts.append(f'''
  <div class="section-block">
    <div class="section-title">一句话了解</div>
    <div class="section-content">{desc_text}</div>
  </div>''')

    parts.append(f'''
  <div class="page-footer">
    <span>专业就业通 · zhuanyeyun.com · 第 {page_num} 页</span>
    <span class="footer-cta">公众号「AI应用铺子」回复「报考指南」免费领取更多</span>
  </div>
</div>''')

    return '\n'.join(parts)

# ─── CSS ────────────────────────────────────────────

CSS = '''
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');

  :root {
    --primary: #1e5fd9; --primary-light: #e8f0fe; --dark: #1a1a2e;
    --medium: #5f6368; --light: #9aa0a6; --accent: #f4511e;
    --green: #0d904f; --red: #d93025; --bg: #f8f9fb;
    --white: #ffffff; --border: #dadce0; --tag-bg: #e8f0fe;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif;
    color: var(--dark); background: #fff;
  }

  .cover {
    width: 210mm; height: 297mm;
    background: linear-gradient(135deg, #0d3b8c 0%, #1e5fd9 40%, #3b82f6 100%);
    display: flex; flex-direction: column; justify-content: center;
    padding: 60px;
  }
  .cover::before { content:''; position:absolute; top:38%; left:0; right:0; height:2px; background:rgba(255,255,255,0.15); }
  .cover::after  { content:''; position:absolute; top:66%; left:0; right:0; height:2px; background:rgba(255,255,255,0.15); }
  .cover .badge { display:inline-block; background:rgba(255,255,255,0.15); color:rgba(255,255,255,0.9); padding:6px 18px; border-radius:20px; font-size:13px; font-weight:500; letter-spacing:2px; margin-bottom:30px; width:fit-content; }
  .cover h1 { font-size:42px; font-weight:900; color:#fff; line-height:1.2; margin-bottom:16px; letter-spacing:2px; }
  .cover .subtitle { font-size:24px; font-weight:300; color:rgba(255,255,255,0.85); margin-bottom:40px; letter-spacing:4px; }
  .cover .features { display:flex; flex-direction:column; gap:14px; margin-bottom:60px; }
  .cover .features span { font-size:15px; color:rgba(255,255,255,0.7); font-weight:300; }
  .cover .features span::before { content:'▸ '; color:rgba(255,255,255,0.4); }
  .cover .data-source { font-size:10px; color:rgba(255,255,255,0.4); margin-top:auto; line-height:1.6; }
  .cover .cta-bottom { display:flex; gap:20px; margin-top:20px; }
  .cover .cta-bottom span { font-size:12px; color:rgba(255,255,255,0.75); font-weight:500; }
  .cover .cta-bottom span:last-child { color:rgba(255,255,255,0.5); font-weight:400; }

  .toc { width:210mm; height:297mm; padding:50px 55px; background:#fff; }
  .toc h2 { font-size:26px; font-weight:700; color:var(--dark); margin-bottom:35px; letter-spacing:4px; }
  .toc .toc-list { list-style:none; display:flex; flex-direction:column; gap:0; }
  .toc .toc-list li { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px dotted var(--border); font-size:14px; color:var(--medium); }
  .toc .toc-list li.toc-cta { font-weight:700; color:var(--primary); border-bottom:2px solid var(--primary); }
  .toc .toc-list li .page-num { color:var(--light); font-weight:400; }

  .guide { width:210mm; height:297mm; padding:50px 55px; background:#fff; }
  .guide h2 { font-size:24px; font-weight:700; color:var(--dark); margin-bottom:30px; letter-spacing:2px; }
  .guide-card { background:var(--bg); border-radius:10px; padding:22px 24px; margin-bottom:18px; border-left:4px solid var(--primary); }
  .guide-card h3 { font-size:14px; font-weight:700; color:var(--dark); margin-bottom:8px; }
  .guide-card p { font-size:12px; color:var(--medium); line-height:1.7; font-weight:400; }

  .major-page { width:210mm; min-height:297mm; padding:40px 50px 30px; background:#fff; }
  .major-header { display:flex; align-items:center; gap:12px; padding:14px 18px; background:var(--primary-light); border-radius:8px; margin-bottom:24px; }
  .major-header .major-num { font-size:18px; font-weight:900; color:var(--primary); min-width:30px; }
  .major-header .major-name { font-size:20px; font-weight:700; color:var(--dark); }
  .major-header .major-meta { font-size:11px; color:var(--light); margin-left:auto; }

  .metrics-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
  .metric-card { background:var(--bg); border-radius:10px; padding:16px 18px; text-align:left; border:1px solid var(--border); }
  .metric-card .mc-label { font-size:10px; color:var(--light); font-weight:500; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .metric-card .mc-value { font-size:26px; font-weight:900; margin-bottom:2px; }
  .metric-card .mc-sublabel { font-size:9px; color:var(--light); }

  .section-block { margin-bottom:14px; }
  .section-block .section-title { font-size:12px; font-weight:700; color:var(--dark); margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .section-block .section-title::before { content:''; width:3px; height:14px; background:var(--primary); border-radius:2px; display:inline-block; }
  .section-block .section-content { font-size:11px; color:var(--medium); line-height:1.7; padding-left:12px; font-style:italic; }

  .tag-row { display:flex; flex-wrap:wrap; gap:8px; padding-left:12px; }
  .tag { display:inline-block; background:var(--tag-bg); color:var(--dark); font-size:11px; padding:5px 12px; border-radius:6px; border:1px solid var(--border); font-weight:500; }

  .school-list { list-style:none; padding-left:12px; display:flex; flex-wrap:wrap; gap:6px 16px; }
  .school-list li { font-size:11px; color:var(--medium); }
  .school-list li::before { content:'▸ '; color:var(--primary); font-size:9px; }

  .page-footer { display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid var(--border); margin-top:16px; }
  .page-footer span { font-size:9px; color:var(--light); }
  .page-footer .footer-cta { color:var(--primary); font-weight:700; }

  .cta-page { width:210mm; height:297mm; padding:60px 55px; background:var(--bg); }
  .cta-page h2 { font-size:28px; font-weight:900; color:var(--dark); margin-bottom:8px; }
  .cta-page .cta-price { font-size:22px; font-weight:700; color:var(--primary); margin-bottom:30px; }
  .cta-page .feature-list { list-style:none; margin-bottom:40px; }
  .cta-page .feature-list li { font-size:14px; color:var(--dark); padding:8px 0; padding-left:20px; position:relative; }
  .cta-page .feature-list li::before { content:'✓'; position:absolute; left:0; color:var(--green); font-weight:900; }
  .cta-page .buy-section { background:var(--white); border-radius:12px; padding:28px 32px; border:2px solid var(--primary); }
  .cta-page .buy-section h3 { font-size:18px; font-weight:700; color:var(--dark); margin-bottom:16px; }
  .cta-page .buy-section .wx { font-size:20px; font-weight:900; color:var(--primary); }
  .cta-page .buy-section p { font-size:13px; color:var(--medium); margin-top:6px; }
  .cta-page .buy-section .note { margin-top:14px; font-size:12px; color:var(--light); }
  .cta-page .footer-note { margin-top:auto; font-size:10px; color:var(--light); padding-top:40px; }

  @page { size: A4; margin: 0; }
'''

# ─── 主流程 ─────────────────────────────────────────

def main():
    print(f'⏳ 准备渲染...')
    print(f'   专业数量: {len(majors)}')
    print(f'   总页数: {len(majors) + 4} (含封面/目录/导读/CTA)')

    # 构建 HTML
    toc_items = build_toc()
    major_pages = '\n'.join(build_major_page(m, i) for i, m in enumerate(majors))

    HTML_TEMPLATE = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><style>{CSS}</style></head>
<body>
<div class="cover" style="position:relative">
  <div class="badge">2026 最新版</div>
  <h1>专业报考指南</h1>
  <div class="subtitle">免费试读版</div>
  <div class="features">
    <span>15 个热门专业 · 完整数据解读</span>
    <span>薪资趋势 · 就业率 · AI 风险评估</span>
    <span>给家长和考生的择专业决策参考</span>
  </div>
  <div class="data-source">数据来源：教育部公开数据 · 招聘平台大数据 · 国家统计局 · AI 风险模型</div>
  <div class="cta-bottom">
    <span>公众号「AI应用铺子」回复「报考指南」免费领取</span>
    <span>完整版 244 个专业 · ¥49 · 微信 swgk44</span>
  </div>
</div>

<div class="toc">
  <h2>目&emsp;录</h2>
  <ul class="toc-list">
    <li style="font-weight:500;color:#1a1a2e"><span>如何使用这份指南</span><span class="page-num">3</span></li>
    {toc_items}
    <li class="toc-cta"><span>获取完整版指南（244个专业）</span><span class="page-num">19</span></li>
  </ul>
</div>

<div class="guide">
  <h2>如何使用这份指南</h2>
  <div class="guide-card"><h3>怎么看薪资数据？</h3><p>「起薪」是毕业第一年典型月薪范围；「3年薪资」反映成长速度；「5年涨幅」体现行业红利。注意：高起薪不等于高天花板，有些专业起薪一般但5年后翻倍。</p></div>
  <div class="guide-card"><h3>AI 风险评估怎么看？</h3><p>每个专业都有 AI 替代风险评分（范围 5-90），越低越安全。评分基于我们自研的「任务可自动化程度」模型，综合考量重复性工作占比、创造性要求、人际互动复杂度等因素。</p></div>
  <div class="guide-card"><h3>专业对口率是什么意思？</h3><p>毕业后从事本专业相关工作的比例。对口率低不一定是坏事——文科专业对口率普遍低，但毕业生去互联网、体制内的很多。关键是看「就业岗位」列表里有没有你感兴趣的方向。</p></div>
  <div class="guide-card"><h3>ROI 指数是什么？</h3><p>自研的「投入产出比」指数（0-100），综合学习难度、就业薪资、行业前景。ROI 高 = 同样努力回报更大，适合「不确定喜欢什么」的学生参考。</p></div>
</div>

{major_pages}

<div class="cta-page">
  <h2>想要 244 个专业完整数据？</h2>
  <div class="cta-price">《2026 专业报考完整指南》¥49</div>
  <ul class="feature-list">
    <li>全部 244 个专业的完整数据（非仅 15 个试读）</li>
    <li>每个专业 5 年薪资趋势详细数据</li>
    <li>20+ 所对口院校及参考分数线</li>
    <li>AI 替代风险评估（全网独家模型）</li>
    <li>专业对比矩阵（同时对比 3 个专业）</li>
    <li>买后一年内数据更新免费推送</li>
  </ul>
  <div class="buy-section">
    <h3>购买方式</h3>
    <div class="wx">加微信 swgk44</div>
    <p>备注「完整版」→ 转账 49 元 → 发截图 → 2 小时内收到 PDF</p>
    <p class="note">或关注公众号「AI应用铺子」回复「完整版」获取</p>
  </div>
  <div class="footer-note">www.zhuanyeyun.com</div>
</div>
</body></html>'''

    # 保存 HTML 中间文件（用于调试）
    html_path = os.path.join(PROJECT_ROOT, 'content', 'trial-debug.html')
    os.makedirs(os.path.dirname(html_path), exist_ok=True)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(HTML_TEMPLATE)
    print(f'   HTML 中间文件: {html_path}')

    # 渲染 PDF
    print('📄 渲染 PDF（WeasyPrint, 可能需30-60秒）...')
    doc = HTML(string=HTML_TEMPLATE)
    out_path = os.path.join(PROJECT_ROOT, 'content', '专业报考指南-免费试读版.pdf')
    doc.write_pdf(out_path)

    size_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f'\n✅ PDF 生成完成！')
    print(f'   输出: {out_path}')
    print(f'   大小: {size_mb:.1f} MB')
    print(f'   页数: {len(majors) + 4} 页')
    print(f'   覆盖: {len(majors)} 个热门专业')

if __name__ == '__main__':
    main()
