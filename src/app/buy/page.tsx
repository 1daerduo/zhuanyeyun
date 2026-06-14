import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '《2026专业报考完整指南》—— 189个专业数据 + AI分析 | 专业就业通',
  description: '基于教育部公开数据+招聘平台大数据+AI风险模型，189个专业全覆盖。含薪资趋势、就业率、AI替代风险、院校推荐。免费试读版可领取。',
};

const FAQ_ITEMS = [
  {
    q: '买了能退吗？',
    a: '因为是数字产品，发货后原则上不支持退款。但你可以在购买前先领取免费试读版，确认满意再购买完整版。',
  },
  {
    q: '数据靠谱吗？来源是什么？',
    a: '数据来源于：教育部就业质量报告、招聘平台公开数据、各高校就业质量报告。AI风险评估基于我们自建的评估模型。数据标注了来源和时效性。',
  },
  {
    q: '多久能收到？',
    a: '付款后截图发微信，工作日一般2小时内发你下载链接。晚上和周末稍慢一点，但24小时内一定发。',
  },
  {
    q: 'PDF能在手机上看吗？',
    a: '可以。PDF格式在手机、平板、电脑上都能打开。文件不大（约15MB），微信直接传。',
  },
  {
    q: '数据和网站上的有区别吗？',
    a: '有。网站展示的是每个专业的概要信息，PDF里的完整版多了：5年薪资趋势图、20+对口院校名单及分数线、10个常见问题深度解答、专业对比矩阵。',
  },
  {
    q: '后续会不会更新？',
    a: '购买后一年内，如果数据有重大更新（如新的就业报告），会免费发你更新版。',
  },
];

const TIERS = [
  {
    name: '免费试读版',
    price: '0',
    desc: '先看看，确定有用再买',
    features: [
      '10个热门专业的基础数据',
      '薪资排行TOP30速览',
      'AI时代专业选择指南（3页）',
      '含网站同款数据',
    ],
    bgGradient: 'from-gray-50 to-gray-100',
    border: 'border-gray-300',
    btnColor: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
    highlight: false,
    cta: '免费领取',
  },
  {
    name: '完整版',
    price: '49',
    desc: '189个专业全覆盖，性价比最高',
    features: [
      '全部189个专业的完整数据',
      '每个专业5年薪资趋势图',
      '20+对口院校及分数线',
      'AI替代风险评估（全网独家）',
      '专业对比矩阵（一键比3个）',
      'PDF格式，手机随时查看',
      '买后一年内数据更新免费推送',
    ],
    bgGradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-300',
    btnColor: 'bg-blue-600 text-white hover:bg-blue-700',
    highlight: true,
    badge: '🔥 最受欢迎',
    cta: '立即购买 ¥49',
  },
];

export default function BuyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          《2026专业报考完整指南》
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          189个专业 · 5年薪资趋势 · AI风险评估 · 院校推荐
        </p>
        <p className="text-sm text-gray-400 mt-2">
          基于教育部就业质量报告 + 招聘平台大数据 + 自研AI风险模型
        </p>
      </div>

      {/* 社会证明 */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">189</div>
          <div className="text-xs text-gray-500">专业全覆盖</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">54</div>
          <div className="text-xs text-gray-500">所院校数据</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-600">12</div>
          <div className="text-xs text-gray-500">大学科门类</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">5年</div>
          <div className="text-xs text-gray-500">薪资趋势追踪</div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {TIERS.map((tier, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${tier.bgGradient} border-2 ${tier.border} ${tier.highlight ? 'shadow-lg shadow-blue-200/50 scale-[1.02]' : ''}`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                {tier.badge}
              </span>
            )}
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h2>
              <p className="text-sm text-gray-500">{tier.desc}</p>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">¥{tier.price}</span>
                {tier.price !== '0' && <span className="text-gray-400 text-sm ml-1">/ 永久有效</span>}
              </div>
            </div>

            <ul className="space-y-2.5 mb-6">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="#how-to-buy"
              className={`block w-full text-center font-semibold py-3 rounded-xl transition-all text-sm sm:text-base ${tier.btnColor}`}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

      {/* How to Buy (微信私域成交流程) */}
      <div id="how-to-buy" className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">📱 如何购买（3步）</h2>
        <p className="text-sm text-gray-600 text-center mb-6">网站不接支付接口，通过微信手动交易，安全简单</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {[
            { step: '1', title: '扫码加微信', desc: '备注"报考指南"，我会第一时间通过好友验证' },
            { step: '2', title: '微信转账', desc: '说明要哪个版本（免费试读/¥49完整版），我发收款码' },
            { step: '3', title: '收到资料', desc: '付款后发你PDF下载链接，微信直接传文件也可以' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* WeChat QR Placeholder */}
        <div className="bg-white rounded-2xl p-6 text-center border border-green-100 max-w-sm mx-auto">
          <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-400">
              <div className="text-3xl mb-1">📷</div>
              <div className="text-xs">请替换为你的<br />微信二维码</div>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900">微信号：<span className="text-blue-600">【请替换为你的微信号】</span></p>
          <p className="text-xs text-gray-400 mt-1">加好友请备注{'"'}报考指南{'"'}</p>
        </div>
      </div>

      {/* 内容预览 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📖 指南内容预览</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { emoji: '📊', title: '专业数据卡片', desc: '每个专业含起薪、3年/5年薪资、就业率、专业相关度、满意度，一目了然' },
            { emoji: '📈', title: '薪资增长趋势', desc: '各专业近5年薪资走势图，一眼看出哪些专业在涨、哪些在跌' },
            { emoji: '🤖', title: 'AI风险评估', desc: '基于自研模型的AI替代风险评估，告诉你哪些专业最安全、哪些需要警惕' },
            { emoji: '🏫', title: '院校推荐', desc: '每个专业的对口强校名单，含985/211/双非不同层次推荐' },
            { emoji: '🔄', title: '专业对比矩阵', desc: '最多同时对比3个专业，从薪资到就业到AI风险一站式比较' },
            { emoji: '❓', title: '高频问答', desc: '每个专业配置10个家长和学生最常问的问题和解答' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.emoji}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 为什么值得信赖</h2>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>数据来源透明。</strong>所有薪资和就业数据均来自教育部直属高校的《毕业生就业质量年度报告》、主流招聘平台的公开薪资数据。我们不做任何主观猜测。
          </p>
          <p>
            <strong>AI评估模型有依据。</strong>AI替代风险的评估基于我们自研的{'\"'}任务可自动化程度{'\"'}模型，综合考量了：重复性任务占比、创造性工作占比、人际互动复杂度、法规/伦理屏障等维度。
          </p>
          <p>
            <strong>不是{'\"'}报志愿机构{'\"'}。</strong>我们不做填报服务、不推荐具体学校、不收取任何咨询服务费。这份指南是数据整理和分析的结果，目的是让你有更全面的信息做决定。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">❓ 常见问题</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="bg-white border border-gray-200 rounded-xl">
              <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600">
                {item.q}
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">多一分数据，少一分后悔</h2>
        <p className="text-blue-100 mb-5 text-sm sm:text-base">高考志愿只有一次，189个专业的完整数据帮你做更明智的选择</p>
        <a
          href="#how-to-buy"
          className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl text-sm sm:text-base hover:bg-blue-50 transition-colors"
        >
          免费试读 · 立即领取
        </a>
        <p className="text-xs text-blue-200 mt-3">也可以直接访问 zhuanyeyun.com 浏览免费数据</p>
      </div>

      {/* Back link */}
      <div className="text-center mt-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
