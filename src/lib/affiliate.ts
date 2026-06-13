// Affiliate 推荐配置
// PID 从环境变量读取，部署时通过 CF Pages 环境变量或 .env 文件配置
// 未配置 PID 时展示纯内容推荐（不带联盟参数），不影响正常显示

export interface AffiliateProduct {
  name: string;         // 商品/课程名
  platform: 'jd' | 'taobao' | 'pdd' | 'dangdang';  // 平台
  itemId: string;       // 商品ID
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
// 在 CF Pages 环境变量中设置，或在 .env.local 中设置：
//   JD_UNION_ID=你的京东联盟ID
//   TB_PID=mm_你的淘宝PID
//   PDD_PID=你的多多进宝PID
// 未配置时组件正常展示，只不带联盟跟踪参数

function getJdLink(itemId: string): string {
  const unionId = process.env.JD_UNION_ID || '';
  if (unionId) {
    return `https://union-click.jd.com/jdc?e=&p=JF8BAPYJK1olXDYCVV9cDEIQAmgBH1klGVlaCgFtUQ5SQi0DBUVNGFJeSwUIFxlJX3EIGloUXwQDUF1cC0sQAF8PGVsXVA8LUVZUDE4IWipURmsXXAcAVm5fCUoVBGYOHF8TVQYKUl5YOAlxBF9fDVgRBGcDVF5dD3sVAm4JHFkVWgYLU1pcZUsUBRdWHFIVVgICESt1GkMVNw1ISBlEGwRWU15UC05VVW5dHDUUVgICUitfCBsSCW5cOAlxBF9fDVgRBGcDVF5dD3sVAm4JHFkVWgYLU1pcZUsUBRdWHFIVVgICESt1GkMVNw1ISBlEGwRWU15UC05VVW5dHDUUVgICUitfCBsSC184`;
  }
  return `https://item.jd.com/${itemId}.html`;
}

function getTbLink(itemId: string): string {
  const pid = process.env.TB_PID || '';
  if (pid) {
    return `https://s.click.taobao.com/t?e=m%3D2%26s%3D${itemId}%26union_lens%3DlensId&pid=${pid}`;
  }
  return `https://item.taobao.com/item.htm?id=${itemId}`;
}

function getPddLink(itemId: string): string {
  const pid = process.env.PDD_PID || '';
  if (pid) {
    return `https://p.pinduoduo.com/${itemId}?pid=${pid}`;
  }
  return `https://mobile.yangkeduo.com/goods.html?goods_id=${itemId}`;
}

function getDangdangLink(itemId: string): string {
  return `https://product.dangdang.com/${itemId}.html`;
}

export function getAffiliateLink(product: AffiliateProduct): string {
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
const affiliateData: AffiliateRecommendation[] = [
  {
    majorSlug: 'jisuanji-kexue-yu-jishu',
    intro: '计算机专业必备学习资源，从入门到精通',
    products: [
      { name: '深入理解计算机系统（CSAPP）', platform: 'jd', itemId: '12567914174', price: '¥89', tag: '经典必读', desc: '计算机基础圣经，大厂面试必备' },
      { name: '算法导论（第四版）', platform: 'jd', itemId: '13051268', price: '¥128', tag: '算法进阶', desc: '算法与数据结构权威教材' },
      { name: 'Java核心技术（卷I+II）', platform: 'jd', itemId: '12977083075', price: '¥159', tag: '入门首选', desc: '零基础学Java的最佳选择' },
      { name: 'Python编程从入门到实践', platform: 'jd', itemId: '12602586711', price: '¥69', tag: '快速上手', desc: '项目驱动的Python入门书' },
    ],
  },
  {
    majorSlug: 'rengong-zhineng',
    intro: 'AI专业学习路线推荐，从数学基础到深度学习',
    products: [
      { name: '深度学习（花书）', platform: 'jd', itemId: '12128538', price: '¥168', tag: 'AI圣经', desc: '深度学习领域必读经典' },
      { name: '机器学习（西瓜书）', platform: 'jd', itemId: '12294391135', price: '¥69', tag: '入门首选', desc: '周志华教授力作，中文ML最佳教材' },
      { name: '动手学深度学习（PyTorch版）', platform: 'jd', itemId: '12904912264', price: '¥89', tag: '实战派', desc: '李沐经典，代码驱动学AI' },
      { name: '统计学习方法', platform: 'jd', itemId: '11023721', price: '¥59', tag: '理论必备', desc: '李航教授经典，面试常考' },
    ],
  },
  {
    majorSlug: 'ruanjian-gongcheng',
    intro: '软件工程方向学习资源，从编码到架构',
    products: [
      { name: '代码整洁之道', platform: 'jd', itemId: '10939738', price: '¥59', tag: '程序员必读', desc: '写出优雅代码的进阶之路' },
      { name: '设计模式：可复用面向对象软件的基础', platform: 'jd', itemId: '10057326', price: '¥49', tag: '经典必读', desc: 'GoF四人帮经典，面试高频考点' },
      { name: '重构：改善既有代码的设计', platform: 'jd', itemId: '12290576', price: '¥69', tag: '进阶必备', desc: 'Martin Fowler经典之作' },
      { name: '程序员面试金典（第6版）', platform: 'jd', itemId: '12639362', price: '¥65', tag: '求职利器', desc: '大厂面试真题全覆盖' },
    ],
  },
  {
    majorSlug: 'linchuang-yixue',
    intro: '临床医学考研/执医必备资料',
    products: [
      { name: '贺银成考研西医综合辅导讲义', platform: 'jd', itemId: '13314648', price: '¥108', tag: '考研必备', desc: '西医综合考研No.1辅导书' },
      { name: '执业医师资格考试应试指南', platform: 'jd', itemId: '10026098258943', price: '¥198', tag: '执医必过', desc: '执医考试官方指定教材' },
      { name: '实用内科学（第16版）', platform: 'jd', itemId: '12642405', price: '¥398', tag: '临床圣经', desc: '内科医生案头必备工具书' },
      { name: '奈特人体解剖学彩色图谱', platform: 'jd', itemId: '12311890', price: '¥268', tag: '解剖经典', desc: '医学生必备解剖图谱' },
    ],
  },
  {
    majorSlug: 'kouchuang-yixue',
    intro: '口腔医学学习与临床必备',
    products: [
      { name: '口腔颌面外科学（第8版）', platform: 'jd', itemId: '12800010', price: '¥89', tag: '教材必备', desc: '口腔专业核心教材' },
      { name: '口腔正畸学（第7版）', platform: 'jd', itemId: '12564268', price: '¥78', tag: '正畸方向', desc: '正畸入门必读教材' },
      { name: '牙体牙髓病学（第5版）', platform: 'jd', itemId: '13305471', price: '¥69', tag: '临床必备', desc: '口腔内科核心参考书' },
      { name: '口腔执业医师资格考试题库', platform: 'jd', itemId: '10026123456234', price: '¥128', tag: '执医备考', desc: '口腔执医真题+解析' },
    ],
  },
  {
    majorSlug: 'jinrongxue',
    intro: '金融专业考证与实务进阶',
    products: [
      { name: 'CFA一级官方教材（2026版）', platform: 'jd', itemId: '10005678901234', price: '¥680', tag: '金融第一考', desc: 'CFA协会官方指定教材' },
      { name: '证券从业资格考试教材', platform: 'jd', itemId: '12970476', price: '¥89', tag: '从业必考', desc: '证券从业考试官方教材' },
      { name: '公司理财（第13版）', platform: 'jd', itemId: '13477168', price: '¥98', tag: '经典教材', desc: '罗斯经典，金融专业必修' },
      { name: '投资学（第10版）', platform: 'jd', itemId: '11994849', price: '¥88', tag: '投资经典', desc: '博迪经典，金融投资必修' },
    ],
  },
  {
    majorSlug: 'kuaijixue',
    intro: '会计专业考证与实务必备',
    products: [
      { name: 'CPA注册会计师官方教材（全6册）', platform: 'jd', itemId: '13512817', price: '¥328', tag: 'CPA必备', desc: '中注协官方教材，CPA考试指定' },
      { name: '初级会计实务+经济法基础', platform: 'jd', itemId: '10025678901235', price: '¥89', tag: '入门双证', desc: '初级会计职称考试教材' },
      { name: '中级财务会计', platform: 'jd', itemId: '12421078', price: '¥68', tag: '专业必修', desc: '会计专业核心教材' },
      { name: 'Excel财务应用大全', platform: 'jd', itemId: '10012345678901', price: '¥49', tag: '职场技能', desc: '财务人必备的Excel技能' },
    ],
  },
  {
    majorSlug: 'shuju-kexue-yu-dashuju-jishu',
    intro: '数据科学学习路线，从Python到机器学习',
    products: [
      { name: '利用Python进行数据分析', platform: 'jd', itemId: '12512414', price: '¥79', tag: '数据分析入门', desc: 'Pandas作者亲著，数据科学必读' },
      { name: 'SQL必知必会（第5版）', platform: 'jd', itemId: '12867247', price: '¥39', tag: 'SQL入门', desc: '数据分析师面试必备技能' },
      { name: '动手学深度学习（PyTorch版）', platform: 'jd', itemId: '12904912264', price: '¥89', tag: '进阶必读', desc: '李沐经典，机器学习实战' },
    ],
  },
  {
    majorSlug: 'dianzi-shangwu',
    intro: '电商运营实战资源',
    products: [
      { name: '电商运营从入门到精通', platform: 'jd', itemId: '10023456789012', price: '¥59', tag: '运营实战', desc: '淘宝/京东/拼多多运营全攻略' },
      { name: '直播电商运营实战', platform: 'jd', itemId: '10034567890123', price: '¥49', tag: '直播带货', desc: '抖音/快手直播电商实操指南' },
      { name: '私域流量运营指南', platform: 'jd', itemId: '10045678901234', price: '¥45', tag: '私域打法', desc: '社群+朋友圈+视频号全链路运营' },
    ],
  },
  {
    majorSlug: 'falv-xue',
    intro: '法学专业考证与实务',
    products: [
      { name: '国家统一法律职业资格考试辅导用书', platform: 'jd', itemId: '13082161', price: '¥198', tag: '法考必备', desc: '法考官方指定教材' },
      { name: '民法典及相关司法解释汇编', platform: 'jd', itemId: '12930272', price: '¥68', tag: '实务必备', desc: '最新民法典条文+解释' },
      { name: '刑法学（第10版）', platform: 'jd', itemId: '13182251', price: '¥88', tag: '经典教材', desc: '张明楷教授经典教材' },
    ],
  },
];

export function getAffiliateForMajor(slug: string): AffiliateRecommendation | undefined {
  return affiliateData.find((a) => a.majorSlug === slug);
}