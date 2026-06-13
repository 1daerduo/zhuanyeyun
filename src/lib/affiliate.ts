// Affiliate 推荐配置
// PID 从环境变量读取，部署时通过 CF Pages 环境变量或 .env 文件配置
// 未配置 PID 时展示纯内容推荐（不带联盟参数），不影响正常显示

export interface AffiliateProduct {
  name: string;         // 商品/课程名
  platform: 'jd' | 'taobao' | 'pdd' | 'dangdang';  // 平台
  itemId: string;       // 商品ID（数字）或完整推广短链（https://...开头）
  price: string;        // 价格区间
  tag: string;          // 推荐标签（如"入门必读"/"考证必备"）
  desc: string;         // 一句话推荐理由
}

export interface AffiliateRecommendation {
  majorSlug: string;
  intro: string;        // 区块导语
  products: AffiliateProduct[];
}

// ====== PID 配置 ======
// 默认 PID（老板的联盟账号），未配置环境变量时自动使用
// 淘宝联盟 PID 格式：mm_站点ID_推广者ID_推广位ID
// 多多进宝 PID 格式：推广者ID_推广位ID

const DEFAULT_PIDS = {
  jd: '',                       // 京东联盟：在 union.jd.com 获取
  tb: 'mm_119638500_19524471_72688686',  // 淘宝联盟 PID
  pdd: '44488933_316432727',         // 多多进宝 PID
};

function getJdLink(itemId: string): string {
  const unionId = process.env.JD_UNION_ID || DEFAULT_PIDS.jd;
  if (unionId) {
    // 京东联盟链接格式：https://union-click.jd.com/jdc?e=&p=...
    // itemId 传入商品ID，unionId 传入联盟ID
    return `https://union-click.jd.com/jdc?e=&p=JF8CARsJK1olXDYCVV9cDEUaAmoCH1JSSQVFdVxrUxsrVA9SQi0DBUVNGFJeSwUIFxlJX3EIGloUXwQDUF1cC0sQAF8PGVsXVA8LUVYLVQ4IWipURmsXXAcAVm5fCUoVBGYOHF8TVgYKUl5YOAlxBF9fDVgRBGcDVF5dD3sVAm4JHFkVWgYLU1pcZUsUBRdWHFIVVgICESt1GkMVNw1ISBlEGwRWU15UC05VVW5dHDUUVgICUitfCBsSCW5cOAlxBF9fDVgRBGcDVF5dD3sVAm4JHFkVWgYLU1pcZUsUBRdWHFIVVgICESt1GkMVNw1ISBlEGwRWU15UC05VVW5dHDUUVgICUitfCBsSC184&u=https%3A%2F%2Fitem.jd.com%2F${itemId}.html`;
  }
  return `https://item.jd.com/${itemId}.html`;
}

function getTbLink(itemId: string): string {
  const pid = process.env.TB_PID || DEFAULT_PIDS.tb;
  if (pid) {
    // 淘宝联盟短链格式：https://s.click.taobao.com/t?pid=PID&itemId=ITEMID
    // itemId 是商品ID（数字），pid 是三段式 PID
    return `https://s.click.taobao.com/t?pid=${pid}&itemId=${itemId}&target_type=4&oOrp=1`;
  }
  return `https://item.taobao.com/item.htm?id=${itemId}`;
}

function getPddLink(itemId: string): string {
  const pid = process.env.PDD_PID || DEFAULT_PIDS.pdd;
  if (pid) {
    // 多多进宝推广链接格式
    // goods_id 是商品ID，pdd_duoi 是推广位ID（两段式）
    return `https://mobile.yangkeduo.com/goods.html?goods_id=${itemId}&pdd_duoi=${pid}`;
  }
  return `https://mobile.yangkeduo.com/goods.html?goods_id=${itemId}`;
}

function getDangdangLink(itemId: string): string {
  return `https://product.dangdang.com/${itemId}.html`;
}

export function getAffiliateLink(product: AffiliateProduct): string {
  // 如果 itemId 已经是完整推广短链，直接返回
  if (product.itemId.startsWith('https://')) {
    return product.itemId;
  }
  // 空 ID → 无链接，返回空字符串让组件渲染纯文字
  if (!product.itemId) {
    return '';
  }
  // 否则按平台生成链接
  switch (product.platform) {
    case 'jd': return getJdLink(product.itemId);
    case 'taobao': return getTbLink(product.itemId);
    case 'pdd': return getPddLink(product.itemId);
    case 'dangdang': return getDangdangLink(product.itemId);
  }
}

export function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
    jd: '京东', taobao: '淘宝', pdd: '拼多多', dangdang: '当当',
  };
  return names[platform] || platform;
}

// 热门专业的推荐商品
// 注意：京东/淘宝联盟需要网站备案审核，暂不可用
// 目前使用拼多多（多多进宝）推广短链，直接复制后台生成的链接
const affiliateData: AffiliateRecommendation[] = [
  {
    majorSlug: 'jisuanji-kexue-yu-jishu',
    intro: '计算机专业必备学习资源，从入门到精通——以下链接已挂多多进宝推广',
    products: [
      { name: 'CSAPP深入理解计算机系统（第3版）', platform: 'pdd', itemId: 'https://p.pinduoduo.com/QnRqnBIT?sc=EFAC', price: '¥69.50', tag: '经典必读', desc: '计算机基础圣经，大厂面试必备' },
      { name: 'Python/C语言编程从入门到精通', platform: 'pdd', itemId: 'https://p.pinduoduo.com/rSuqyula?sc=EFAC', price: '¥30.80', tag: '入门首选', desc: '零基础自学编程的最佳选择' },
    ],
  },
  {
    majorSlug: 'rengong-zhineng',
    intro: 'AI专业学习路线推荐，从数学基础到深度学习',
    products: [
      { name: 'AI人工智能与大数据教程（64G U盘）', platform: 'pdd', itemId: 'https://p.pinduoduo.com/9VQqofeO?sc=EFAC', price: '¥58.00', tag: '实战派', desc: '机器学习+人工智能算法全套学习资源' },
    ],
  },
  {
    majorSlug: 'ruanjian-gongcheng',
    intro: '软件工程方向学习资源，从编码到架构',
    products: [
      { name: 'Java开发零基础到精通视频教程', platform: 'pdd', itemId: 'https://p.pinduoduo.com/XyOqxAON?sc=EFAC', price: '¥88.16', tag: '入门首选', desc: 'Java全栈开发自学视频教程（U盘版）' },
    ],
  },
  {
    majorSlug: 'linchuang-yixue',
    intro: '临床医学考研/执医必备资料（京东/淘宝联盟需备案，推广链接待补充）',
    products: [
      { name: '贺银成考研西医综合辅导讲义', platform: 'jd', itemId: '', price: '¥108', tag: '考研必备', desc: '西医综合考研No.1辅导书' },
      { name: '执业医师资格考试应试指南', platform: 'jd', itemId: '', price: '¥198', tag: '执医必过', desc: '执医考试官方指定教材' },
    ],
  },
  {
    majorSlug: 'kouchuang-yixue',
    intro: '口腔医学学习与临床必备（推广链接待补充）',
    products: [
      { name: '口腔颌面外科学（第8版）', platform: 'jd', itemId: '', price: '¥89', tag: '教材必备', desc: '口腔专业核心教材' },
      { name: '口腔正畸学（第7版）', platform: 'jd', itemId: '', price: '¥78', tag: '正畸方向', desc: '正畸入门必读教材' },
    ],
  },
  {
    majorSlug: 'jinrongxue',
    intro: '金融专业考证与实务进阶（推广链接待补充）',
    products: [
      { name: 'CFA一级官方教材（2026版）', platform: 'jd', itemId: '', price: '¥680', tag: '金融第一考', desc: 'CFA协会官方指定教材' },
      { name: '证券从业资格考试教材', platform: 'jd', itemId: '', price: '¥89', tag: '从业必考', desc: '证券从业考试官方教材' },
    ],
  },
  {
    majorSlug: 'kuaijixue',
    intro: '会计专业考证与实务必备（推广链接待补充）',
    products: [
      { name: 'CPA注册会计师官方教材（全6册）', platform: 'jd', itemId: '', price: '¥328', tag: 'CPA必备', desc: '中注协官方教材，CPA考试指定' },
      { name: '初级会计实务+经济法基础', platform: 'jd', itemId: '', price: '¥89', tag: '入门双证', desc: '初级会计职称考试教材' },
    ],
  },
  {
    majorSlug: 'shuju-kexue-yu-dashuju-jishu',
    intro: '数据科学学习路线，从Python到机器学习',
    products: [
      { name: 'Python/C语言编程从入门到精通', platform: 'pdd', itemId: 'https://p.pinduoduo.com/rSuqyula?sc=EFAC', price: '¥30.80', tag: '入门首选', desc: '零基础自学Python+数据分析的起步教材' },
    ],
  },
  {
    majorSlug: 'dianzi-shangwu',
    intro: '电商运营实战资源（多多进宝推广链接可补充，去后台搜"电商运营"）',
    products: [],
  },
  {
    majorSlug: 'falv-xue',
    intro: '法学专业考证与实务（推广链接待补充）',
    products: [
      { name: '国家统一法律职业资格考试辅导用书', platform: 'jd', itemId: '', price: '¥198', tag: '法考必备', desc: '法考官方指定教材' },
    ],
  },
];

export function getAffiliateForMajor(slug: string): AffiliateRecommendation | undefined {
  return affiliateData.find((a) => a.majorSlug === slug);
}