import { Metadata } from 'next';
import Link from 'next/link';
import { getAllMajors } from '@/lib/majors';
import type { Major } from '@/lib/types';
import CTABanner from '@/components/CTABanner';

export function generateStaticParams() {
  return [
    { category: 'gaoxin' },
    { category: 'jiuye' },
    { category: 'ai-safe' },
    { category: 'roi' },
    { category: 'manyidu' },
    { category: 'gongxue' },
    { category: 'lixue' },
    { category: 'yixue' },
    { category: 'jingjixue' },
    { category: 'guanlixue' },
    { category: 'faxue' },
    { category: 'wenxue' },
    { category: 'jiaoyuxue' },
  ];
}

interface RankingConfig {
  title: string;
  description: string;
  sortFn: (a: Major, b: Major) => number;
  key: string;
  unit: string;
  color: string;
  bgColor: string;
}

const RANKING_CATEGORIES: Record<string, RankingConfig> = {
  gaoxin: {
    title: '高薪专业排行榜',
    description: '按2025届毕业生平均起薪排序，展示收入最高的专业方向',
    sortFn: (a, b) => b.starting_salary - a.starting_salary,
    key: 'starting_salary',
    unit: '元/月',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  jiuye: {
    title: '就业率最高专业排行榜',
    description: '按2025届毕业生就业率排序，展示就业形势最好的专业',
    sortFn: (a, b) => b.employment_rate - a.employment_rate,
    key: 'employment_rate',
    unit: '%',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  'ai-safe': {
    title: 'AI抗风险专业排行榜',
    description: '按AI替代风险评分排序（分数越低越安全），展示最难被AI取代的专业',
    sortFn: (a, b) => a.ai_risk_score - b.ai_risk_score,
    key: 'ai_risk_score',
    unit: '分',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  roi: {
    title: '专业投资回报率排行榜',
    description: '按综合ROI评分排序，综合考虑薪资、就业率、专业相关度和AI抗风险能力',
    sortFn: (a, b) => b.roi_index - a.roi_index,
    key: 'roi_index',
    unit: '分',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  manyidu: {
    title: '就业满意度排行榜',
    description: '按毕业生就业满意度排序，展示从业者幸福感最高的专业',
    sortFn: (a, b) => b.satisfaction - a.satisfaction,
    key: 'satisfaction',
    unit: '%',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
};

const CATEGORY_MAP: Record<string, string> = {
  gongxue: '工学', lixue: '理学', yixue: '医学',
  jingjixue: '经济学', guanlixue: '管理学', faxue: '法学',
  wenxue: '文学', jiaoyuxue: '教育学',
};

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const config = RANKING_CATEGORIES[params.category];
  const catName = CATEGORY_MAP[params.category];
  if (config) {
    return { title: `${config.title}（2026最新）`, description: config.description };
  }
  if (catName) {
    return {
      title: `${catName}类专业就业前景排行`,
      description: `${catName}类各专业的就业前景、薪资、就业率综合分析排名`,
    };
  }
  return { title: '排行榜' };
}

// ====== 高薪岗位深度解读 ======
const GAOXIN_HOT_POSITIONS = [
  {
    title: '人工智能/机器学习工程师',
    salary: '25,000-80,000',
    growth: 'AI技术在各行业快速渗透，人才缺口超500万',
    majors: ['人工智能', '计算机科学与技术', '数据科学与大数据技术', '数学与应用数学'],
    demand: '供不应求',
    insight: '不仅是互联网公司，金融、医疗、制造业都在抢AI人才。985硕士起薪普遍30K+，博士直接给到P7级别50K+。2026年国内外AI公司融资回暖，用人需求井喷。',
  },
  {
    title: '芯片/半导体工程师',
    salary: '20,000-60,000',
    growth: '国产芯片自主化国家战略，政策+资本双重驱动',
    majors: ['微电子科学与工程', '集成电路设计与集成系统', '电子科学与技术', '电子信息工程'],
    demand: '极度紧缺',
    insight: '美国芯片出口管制反而加速了国内半导体产业爆发。中芯国际、华为海思、长鑫存储等企业大量招人，应届硕士起薪25K+，5年经验轻松翻倍。这是未来10年的黄金赛道。',
  },
  {
    title: '软件架构师/高级开发',
    salary: '18,000-55,000',
    growth: '数字化转型持续深化，全行业需求稳定增长',
    majors: ['软件工程', '计算机科学与技术', '网络工程'],
    demand: '需求旺盛',
    insight: '虽然AI写代码在进步，但复杂系统设计、业务架构、技术选型仍需要人类。一线大厂应届生25K起跳，3-5年经验跳槽涨幅30-50%很常见。关键是：选对方向（云原生/分布式/安全）比选对公司更重要。',
  },
  {
    title: '量化金融/金融科技',
    salary: '20,000-70,000',
    growth: '量化交易+金融AI赛道扩容，头部机构薪资天花板极高',
    majors: ['金融工程', '金融学', '数学与应用数学', '统计学'],
    demand: '精英稀缺',
    insight: '头部量化私募（幻方、九坤）应届生年薪60万+很常见，但门槛极高——清北复交硕士起步+ACM金牌+因子研究经验。金融科技方向更大众化：券商/银行/保险的科技部门薪资虽比不上量化，但18-25K起薪+年终6-12个月也很香。',
  },
];

// Ranking item card (mobile)
function MajorRankCard({ major, rank, config }: { major: Major; rank: number; config: RankingConfig }) {
  const rankBadge = rank <= 3
    ? ['bg-yellow-400', 'bg-gray-300', 'bg-amber-600'][rank - 1]
    : 'bg-gray-200 text-gray-600';

  const highlightVal = (() => {
    const val = major[config.key as keyof Major];
    if (typeof val === 'number') {
      if (config.key === 'starting_salary') return `¥${val.toLocaleString()}/月`;
      return `${val}${config.key === 'employment_rate' || config.key === 'satisfaction' ? '%' : '分'}`;
    }
    return String(val);
  })();

  return (
    <Link
      href={`/major/${major.slug}/`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      {/* Top row: rank + name + highlight */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${rankBadge} ${rank <= 3 ? 'text-white' : 'text-gray-600'}`}>
          {rank + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{major.name}</h3>
          <p className="text-xs text-gray-400">{major.degree} · {major.duration}年 · {major.category}</p>
        </div>
        <div className={`text-right shrink-0`}>
          <span className={`text-lg font-bold ${config.color}`}>{highlightVal}</span>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
        <div className="bg-gray-50 rounded-lg py-1.5">
          <div className="text-gray-400">起薪</div>
          <div className="font-semibold text-blue-600">¥{major.starting_salary.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <div className="text-gray-400">就业率</div>
          <div className="font-semibold text-green-600">{major.employment_rate}%</div>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <div className="text-gray-400">3年薪资</div>
          <div className="font-semibold text-orange-600">¥{major.salary_3year.toLocaleString()}</div>
        </div>
      </div>

      {/* Growth insight */}
      {major.salary_3year > 0 && major.salary_5year > 0 && (
        <div className="text-xs text-gray-500 mb-2">
          📈 3年后约¥{major.salary_3year.toLocaleString()}/月，5年后约¥{major.salary_5year.toLocaleString()}/月
          <span className="text-green-600 font-medium ml-1">
            (+{Math.round((major.salary_5year - major.starting_salary) / major.starting_salary * 100)}%)
          </span>
        </div>
      )}

      {/* Top positions */}
      {major.top_positions && major.top_positions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {major.top_positions.slice(0, 3).map((pos, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{pos}</span>
          ))}
        </div>
      )}

      {/* AI risk */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>🤖 AI风险</span>
        <span className={`font-medium ${
          major.ai_risk_level === '低' ? 'text-green-600' :
          major.ai_risk_level === '中' ? 'text-yellow-600' : 'text-red-600'
        }`}>{major.ai_risk_level}</span>
        <span className="text-gray-400">{major.ai_risk_score}分</span>
      </div>
    </Link>
  );
}

// ====== 高薪排行专属：岗位解读区块 ======
function GaoxinInsightSection() {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-2">2026年高薪热门岗位深度解读</h2>
      <p className="text-sm text-gray-500 mb-6">
        以下是当前就业市场薪资天花板最高、成长速度最快的四大核心赛道。选对方向，比选对学校更关键。
      </p>

      <div className="space-y-5">
        {GAOXIN_HOT_POSITIONS.map((pos, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm sm:text-base">{pos.title}</h3>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{pos.demand}</span>
              </div>
              <p className="text-blue-100 text-xs mt-1">
                💰 月薪范围：{pos.salary}元 · 📊 {pos.growth}
              </p>
            </div>
            <div className="p-4 sm:p-5">
              {/* 家长最关心的洞察 */}
              <div className="flex items-start gap-2 mb-3">
                <span className="text-sm shrink-0 mt-0.5">💡</span>
                <p className="text-sm text-gray-700 leading-relaxed">{pos.insight}</p>
              </div>
              {/* 相关专业 */}
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 shrink-0 mt-0.5">🎓</span>
                <div className="flex flex-wrap gap-1.5">
                  {pos.majors.map((m, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ====== 家长必读：如何理解这个排行榜 ======
function ParentGuideSection({ config }: { config: RankingConfig }) {
  const guides: Record<string, { title: string; content: string }[]> = {
    gaoxin: [
      { title: '高薪≠好专业', content: '薪资只是参考维度之一，还需综合考虑孩子的兴趣爱好、学科优势、以及未来5-10年的行业趋势。比如微电子薪资极高但学习曲线陡峭，不是所有人都适合。' },
      { title: '关注薪资成长空间', content: '起薪重要，但3-5年后的薪资涨幅更能反映一个专业的长期价值。AI相关专业的5年收入涨幅可达120%以上。' },
      { title: '城市差异巨大', content: '同一专业在一线城市和二三线城市的薪资差距可达2-3倍。考虑就业城市比考虑学校排名更影响实际收入。' },
    ],
    jiuye: [
      { title: '就业率≠就业质量', content: '有些专业就业率虽高，但薪资低、专业不对口率高。比如某些人文社科专业就业率超90%，但月薪仅6000元且大量从事销售类工作。' },
      { title: '专业对口率同样关键', content: '学了四年最后做了完全无关的工作，教育投资的回报就打折扣了。工学类专业对口率普遍高于人文社科类。' },
    ],
    'ai-safe': [
      { title: 'AI替代不是非黑即白', content: '大多数专业不会被完全替代，但会被部分改造。医生不会被AI取代，但AI辅助诊断将改变工作方式。关键看专业是否具备"不可编码"的技能（如共情、创造、复杂决策）。' },
      { title: '低风险≠高回报', content: '师范、护理等AI低风险专业虽然不会被替代，但薪资天花板也相对较低。需要在安全性和回报率之间找到平衡。' },
    ],
    roi: [
      { title: 'ROI包含多项指标', content: '我们的ROI指数综合考虑了起薪、薪资增速、就业率、专业相关度、AI风险五个维度，是综合评估值。' },
    ],
    manyidu: [
      { title: '满意度≠躺平', content: '就业满意度高的专业通常工作环境好、社会认同感强，但不代表薪资最高。医疗、教育行业的满意度普遍较高。' },
    ],
  };

  const guideItems = guides[config.key] || guides[Object.keys(RANKING_CATEGORIES).find((k) => RANKING_CATEGORIES[k].key === config.key) || ''] || [];

  if (guideItems.length === 0) return null;

  return (
    <section className="mb-10 bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span>👨‍👩‍👧</span>
        家长必读：如何看懂这份排行榜
      </h3>
      <div className="space-y-3">
        {guideItems.map((item, i) => (
          <div key={i}>
            <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RankingPage({ params }: { params: { category: string } }) {
  const config = RANKING_CATEGORIES[params.category];

  if (config) {
    const sorted = [...getAllMajors()].sort(config.sortFn).slice(0, 30);
    const isGaoxin = params.category === 'gaoxin';

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{config.title}</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-6">{config.description}</p>

        {/* 高薪专属：岗位深度解读 */}
        {isGaoxin && <GaoxinInsightSection />}

        {/* 家长必读 */}
        <ParentGuideSection config={config} />

        {/* ===== Mobile: Card Layout ===== */}
        <div className="md:hidden space-y-3">
          {sorted.map((major, idx) => (
            <MajorRankCard key={major.id} major={major} rank={idx} config={config} />
          ))}
        </div>

        {/* ===== Desktop: Enhanced Table Layout ===== */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-3.5 px-5 font-semibold text-gray-900 w-16">排名</th>
                <th className="text-left py-3.5 px-5 font-semibold text-gray-900">专业名称</th>
                <th className="text-center py-3.5 px-4 font-semibold text-gray-900 w-20">门类</th>
                <th className="text-center py-3.5 px-4 font-semibold text-gray-900">起薪</th>
                <th className="text-center py-3.5 px-4 font-semibold text-gray-900">3年薪资</th>
                <th className="text-center py-3.5 px-4 font-semibold text-gray-900">就业率</th>
                <th className="text-center py-3.5 px-4 font-semibold text-gray-900">ROI</th>
                <th className="text-center py-3.5 px-4 font-semibold text-gray-900">AI风险</th>
                <th className="text-right py-3.5 px-5 font-semibold text-gray-900">核心岗位</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((major, idx) => (
                <tr key={major.id} className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-400 text-white' :
                      idx === 1 ? 'bg-gray-300 text-white' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <Link href={`/major/${major.slug}/`} className="font-semibold text-gray-900 hover:text-blue-600">
                      {major.name}
                    </Link>
                    <div className="text-xs text-gray-400 mt-0.5">{major.degree} · {major.duration}年</div>
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-500">{major.category}</td>
                  <td className="py-3 px-4 text-center font-semibold text-blue-600">¥{major.starting_salary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center font-medium text-orange-600">¥{major.salary_3year.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center font-medium text-green-600">{major.employment_rate}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      major.roi_grade === 'A' ? 'bg-green-100 text-green-700' :
                      major.roi_grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{major.roi_grade}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-medium ${
                      major.ai_risk_level === '低' ? 'text-green-600' :
                      major.ai_risk_level === '中' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {major.ai_risk_level}({major.ai_risk_score})
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {(major.top_positions || []).slice(0, 2).map((pos, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{pos}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CTABanner variant="full" />
      </div>
    );
  }

  // Category filter view
  const catName = CATEGORY_MAP[params.category];
  if (catName) {
    const majors = getAllMajors().filter((m) => m.category === catName).sort((a, b) => b.roi_index - a.roi_index);
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{catName}类专业就业前景</h1>
        <p className="text-gray-500 mb-8">共 {majors.length} 个专业，按ROI综合评分排序</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {majors.map((major) => (
            <Link key={major.id} href={`/major/${major.slug}/`} className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{major.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  major.roi_grade === 'A' ? 'bg-green-100 text-green-700' :
                  major.roi_grade === 'B' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{major.roi_grade}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{major.description.slice(0, 80)}...</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <span>💰 ¥{major.starting_salary.toLocaleString()}/月</span>
                <span>📊 {major.employment_rate}%</span>
                <span>🤖 AI{major.ai_risk_level}</span>
              </div>
              {major.top_positions && major.top_positions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {major.top_positions.slice(0, 2).map((p, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{p}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>

        <CTABanner variant="full" />
      </div>
    );
  }

  // Fallback
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">专业排行榜</h1>
      <p className="text-gray-500 mb-8">选择你关心的排行维度</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(RANKING_CATEGORIES).map(([slug, cat]) => (
          <Link key={slug} href={`/ranking/${slug}/`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <h3 className="font-semibold text-gray-900 mb-1">{cat.title}</h3>
            <p className="text-sm text-gray-500">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
