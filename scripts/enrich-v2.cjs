/**
 * Round 2 数据增强脚本
 * 为 244 个专业补充缺失的高价值字段
 *
 * 新增字段：
 *   course_difficulty   — 课程硬核度 (1-5)
 *   grad_school_necessity — 考研必要性
 *   civil_service_fit   — 考公/考编适合度
 *   transfer_difficulty — 转专业难度
 *   top_employers       — 头部雇主 (3-5个)
 *
 * 补齐字段：
 *   gender_ratio        — 男女比例
 *   recommended_for     — 适合人群
 */

const fs = require('fs');
const path = require('path');

const MAJORS_PATH = path.join(__dirname, '..', 'src', 'data', 'majors.json');
const majors = JSON.parse(fs.readFileSync(MAJORS_PATH, 'utf-8'));

// ─── 规则引擎 ──────────────────────────────────────

function getRules(major) {
  const cat = major.category;
  const slug = major.slug || '';
  const name = major.name || '';

  // 课程硬核度规则
  const difficultyRules = {
    '医学': 5,
    '工学': (s, n) => {
      if (/建筑|土木|水利|测绘/.test(n)) return 5;
      if (/环境|食品|轻化|纺织|包装|安全/.test(n)) return 3;
      if (/计算机|软件|人工智能|数据科学|网络|信息|电子|通信|电气|自动化/.test(n)) return 4;
      return 4; // 工科默认4
    },
    '理学': (s, n) => {
      if (/数学|物理|化学|天文|大气|地球物理/.test(n)) return 5;
      if (/生物|生态|海洋|地质/.test(n)) return 4;
      if (/统计|心理|地理/.test(n)) return 3;
      return 4;
    },
    '法学': 4,
    '经济学': 3,
    '管理学': (s, n) => {
      if (/会计|审计|财务管理|工商管理/.test(n)) return 3;
      return 2;
    },
    '文学': 2,
    '历史学': 3,
    '哲学': 4,
    '教育学': (s, n) => {
      if (/体育|运动/.test(n)) return 2;
      return 2;
    },
    '艺术学': (s, n) => {
      if (/音乐|舞蹈|戏剧|影视/.test(n)) return 2;
      if (/美术|设计|建筑/.test(n)) return 3;
      return 2;
    },
    '农学': 3,
  };

  // 考研必要性规则
  const gradRules = {
    '医学': '通常需要读研/读博，本科就业面很窄',
    '理学': (s, n) => {
      if (/数学|物理|化学|生物|天文/.test(n)) return '建议读研，本科就业以教育/基础岗位为主';
      if (/统计|数据科学/.test(n)) return '本科可就业，读研进大厂/金融更有优势';
      return '建议读研';
    },
    '工学': (s, n) => {
      if (/计算机|软件|人工智能|数据科学|网络/.test(n)) return '本科可就业，但读研后起薪和天花板都更高';
      if (/电子|通信|电气|自动化/.test(n)) return '建议读研，大厂研发岗普遍要求硕士以上';
      if (/建筑|土木/.test(n)) return '建议读研，设计院/规划院门槛较高';
      return '本科可就业，读研更有竞争力';
    },
    '法学': '建议读研，通过法考后本科也能就业，但好所/体制内偏好硕士',
    '经济学': '建议读研，券商/投行/研究岗普遍要求硕士',
    '管理学': (s, n) => {
      if (/会计|审计|财务管理/.test(n)) return '本科可就业，CPA/考研都能提升竞争力';
      if (/工商管理|市场营销/.test(n)) return '本科可就业，建议先工作再读MBA';
      return '本科可就业，考研加分但不必须';
    },
    '文学': '建议读研，教师/编辑/翻译等岗位硕士更具竞争力',
    '历史学': '建议读研，学术路线必须读博，文博/教育硕士足够',
    '哲学': '建议读研/读博，学术路线是主要出路',
    '教育学': '考编为主，考研加分（发达地区教师编普遍要硕士）',
    '艺术学': '作品集比学历重要，但高校教职需要博士',
    '农学': '建议读研，科研院所/大企业研发岗偏好硕士',
  };

  // 考公适合度规则
  const civilRules = {
    '法学': '岗位数量最多，法院/检察院/司法局等大量对口岗位',
    '经济学': (s, n) => {
      if (/财政|税务/.test(n)) return '岗位多，税务局/财政局等高度对口';
      return '有对口岗位，发改委/统计局/银保监等经济类岗位较多';
    },
    '管理学': (s, n) => {
      if (/会计|审计|财务管理/.test(n)) return '岗位多，各类机关都需要财务人员';
      if (/行政管理|公共管理|人力资源/.test(n)) return '岗位多，专业高度对口';
      return '有一定对口岗位，以综合管理岗为主';
    },
    '工学': (s, n) => {
      if (/计算机|软件|信息|网络|数据/.test(n)) return '有对口（信息化岗、网信办、公安技术岗）';
      if (/土木|建筑|水利|交通/.test(n)) return '有对口（住建局、交通局、水利局等）';
      return '少数对口岗位，以三不限为主';
    },
    '文学': (s, n) => {
      if (/汉语言|新闻|传播/.test(n)) return '岗位较多，文秘/宣传/党建岗位大量需求';
      return '有一定对口，外语类有外事办等少量岗位';
    },
    '理学': (s, n) => {
      if (/统计|数学/.test(n)) return '有对口，统计局/大数据局偏好数理背景';
      return '以三不限为主，对口岗位较少';
    },
    '医学': '医院/卫健委体系为主，公务员岗位较少但事业编较多',
    '教育学': '教师编制是主赛道，教育局/考试院等事业编可报',
    '历史学': '以三不限为主，文博/档案馆等少量对口事业编',
    '哲学': '以三不限为主，党校/宣传部等偶有需求',
    '艺术学': '对口岗位较少，以三不限和事业单位（文化馆等）为主',
    '农学': '农业农村局/林业局等少数对口岗位',
  };

  // 转专业难度规则
  const transferRules = {
    '医学': '很难，医学课程体系封闭，学分互认困难',
    '工学': (s, n) => {
      if (/计算机|软件|人工智能|数据科学|信息/.test(n)) return '容易，计算机类课程在线资源丰富，转入门槛低';
      if (/电子|通信|电气|自动化/.test(n)) return '中等，需要一定硬件基础';
      return '中等偏难，工科间交叉较多但需要补专业课';
    },
    '理学': (s, n) => {
      if (/数学/.test(n)) return '容易，数理基础好，转金融/计算机/数据科学都有优势';
      if (/物理/.test(n)) return '中等，物理功底转工科较容易';
      return '中等，理学基础扎实，转相关应用学科可行';
    },
    '法学': '中等，课程体系相对独立，转出以考公/管理岗为主',
    '经济学': '容易，经管类课程体系灵活，转金融/管理/数据科学都可',
    '管理学': '容易，课程壁垒低，转市场营销/运营/HR等灵活',
    '文学': '容易，文科跨转灵活，但转理工科需补大量基础课',
    '历史学': '中等，文科间转较容易，转其他领域需补充技能',
    '哲学': '中等，逻辑思维强，转法律/管理等领域可行',
    '教育学': '中等，转其他文科较容易，但技能型转向需额外学习',
    '艺术学': '中等偏难，技能型专业转出需另学一套技能',
    '农学': '中等，转生物/环境相关方向相对容易',
  };

  // 头部雇主规则
  const employerRules = {
    '工学': {
      '计算机|软件|人工智能|数据': ['华为', '腾讯', '阿里巴巴', '字节跳动', '百度'],
      '电子|通信': ['华为', '中兴', '小米', '中国移动', '中国电信'],
      '电气|自动化': ['国家电网', '华为', '西门子', '比亚迪', '格力'],
      '建筑|土木': ['中国建筑', '万科', '碧桂园', '中国交建', '保利发展'],
      '机械': ['三一重工', '华为', '比亚迪', '徐工集团', '中联重科'],
      default: ['华为', '比亚迪', '国家电网', '中国建筑', '相关行业龙头企业'],
    },
    '理学': {
      '数学|统计': ['阿里巴巴', '腾讯', '中国平安', '国家统计局', '各大银行'],
      '物理': ['华为', '中国航天', '中科院', '中国电子科技集团', '大学/研究所'],
      '化学': ['万华化学', '中石化', '药明康德', '中科院', '巴斯夫'],
      '生物': ['药明康德', '华大基因', '百济神州', '中科院', '辉瑞'],
      default: ['中科院', '各高校', '相关研究所', '教育培训机构', '互联网企业'],
    },
    '医学': {
      '临床|麻醉|医学影像': ['各省三甲医院', '北京协和医院', '四川大学华西医院', '复旦大学附属医院', '解放军总医院'],
      '口腔': ['各口腔专科医院', '连锁口腔诊所', '瑞尔齿科', '通策医疗', '自主开业'],
      '护理': ['各省三甲医院', '社区医疗中心', '养老机构', '国际医疗机构', '医疗美容机构'],
      '药学|中药': ['恒瑞医药', '中国医药集团', '药明康德', '辉瑞', '各大医院药房'],
      '预防|公共卫生': ['疾控中心', '卫健委', '各医院公卫科', '世界卫生组织', '药企医学部'],
      default: ['各省三甲医院', '专科医院', '医药企业', '疾控中心', '卫健委'],
    },
    '法学': {
      default: ['金杜/中伦/方达等一线律所', '各级法院/检察院', '公司法务部', '政府法制办', '金融机构合规部'],
    },
    '经济学': {
      '金融': ['中信证券', '中国工商银行', '中国平安', '中金公司(摩根士丹利合资)', '各大私募/对冲基金'],
      '财政|税务': ['各级税务局', '财政局', '会计师事务所', '企业财务部', '咨询公司'],
      '国际经济|贸易': ['阿里巴巴国际站', '中远海运', '亚马逊', '中国进出口银行', '外贸企业'],
      default: ['各大银行', '证券公司', '保险公司', '基金公司', '政府部门'],
    },
    '管理学': {
      '会计|审计|财务管理': ['普华永道/德勤/安永/毕马威', '各大企业财务部', '税务局', '审计署', '银行'],
      '工商管理|市场营销': ['宝洁', '联合利华', '阿里巴巴', '腾讯', '知名快消/互联网企业'],
      '人力资源': ['各大企业HR部门', '猎头公司', '人力资源咨询公司', '政府部门', '事业单位'],
      default: ['各大企业管理部门', '公务员/事业单位', '咨询公司', '银行', '互联网企业'],
    },
    '文学': {
      '汉语言|新闻|传播': ['人民日报', '新华社', '字节跳动', '腾讯', '新东方'],
      '英语|外语': ['外交部', '新华社', '字节跳动(国际化)', '新东方', '各大外企'],
      default: ['教育培训机构', '出版社', '媒体机构', '互联网内容平台', '文化传媒公司'],
    },
    '历史学': {
      default: ['国家博物馆', '故宫博物院', '各省博物院', '出版社', '教育培训机构'],
    },
    '哲学': {
      default: ['高校/党校', '研究机构', '出版社', '教育培训机构', '文化传媒公司'],
    },
    '教育学': {
      '体育|运动': ['体育局', '健身房/运动品牌', '体育培训机构', '学校', '体育媒体'],
      default: ['各地中小学', '教育局', '教育培训机构', '高校/职业学院', '在线教育平台'],
    },
    '艺术学': {
      '设计|美术': ['网易', '腾讯', '阿里巴巴', '4A广告公司', '独立工作室'],
      '音乐|舞蹈|表演': ['国家大剧院', '文工团', '电视台', '演艺公司', '艺术培训机构'],
      default: ['设计公司', '互联网企业', '文化传媒公司', '艺术培训机构', '独立工作室'],
    },
    '农学': {
      default: ['先正达集团', '大北农', '新希望六和', '隆平高科', '各省农业农村厅'],
    },
  };

  return { difficultyRules, gradRules, civilRules, transferRules, employerRules };
}

// ─── 规则求值 ──────────────────────────────────────

function evalRule(rule, slug, name) {
  if (typeof rule === 'function') return rule(slug, name);
  if (typeof rule === 'string') return rule;
  if (typeof rule === 'number') return rule;
  if (rule && typeof rule === 'object') {
    // 对象匹配: key为关键词正则，value为规则值
    for (const [k, v] of Object.entries(rule)) {
      if (k === 'default') continue;
      if (new RegExp(k).test(name)) return evalRule(v, slug, name);
    }
    return evalRule(rule.default, slug, name);
  }
  return undefined;
}

// ─── gender_ratio 补齐 ──────────────────────────────

function fillGenderRatio(major) {
  if (major.gender_ratio) return major.gender_ratio;

  const cat = major.category;
  const name = major.name;

  const rules = {
    '工学': (n) => {
      if (/纺织|服装|食品/.test(n)) return '女6:男4';
      if (/环境|安全|生物/.test(n)) return '男5:女5';
      return '男7:女3';
    },
    '理学': (n) => {
      if (/生物|生态/.test(n)) return '女6:男4';
      if (/心理|地理/.test(n)) return '女6:男4';
      if (/化学/.test(n)) return '女5:男5';
      return '男6:女4';
    },
    '医学': (n) => {
      if (/护理/.test(n)) return '女9:男1';
      if (/口腔|麻醉|影像|检验|药学|中药|预防|妇幼/.test(n)) return '女6:男4';
      return '男4:女6';
    },
    '法学': '男4:女6',
    '经济学': '男4:女6',
    '管理学': '女6:男4',
    '文学': '女7:男3',
    '历史学': '女6:男4',
    '哲学': '男6:女4',
    '教育学': (n) => {
      if (/体育|运动|武术/.test(n)) return '男8:女2';
      return '女7:男3';
    },
    '艺术学': '女6:男4',
    '农学': '男6:女4',
  };

  const rule = rules[cat];
  if (typeof rule === 'function') return rule(name);
  return rule || '男5:女5';
}

// ─── recommended_for 补齐 ──────────────────────────

function fillRecommendedFor(major) {
  if (major.recommended_for && major.recommended_for.length > 0) return major.recommended_for;

  const cat = major.category;
  const name = major.name;

  const rules = {
    '工学': (n) => {
      if (/建筑|土木|水利|测绘/.test(n)) return ['物理/数学好', '空间想象力强', '吃苦耐劳', '喜欢动手实践'];
      if (/环境|安全|食品|轻化/.test(n)) return ['化学/生物好', '关注可持续发展', '动手实验能力强', '细心负责'];
      if (/机械|车辆|船舶|航空航天/.test(n)) return ['物理好', '动手能力强', '对机械/制造感兴趣', '踏实肯干'];
      if (/材料|冶金|纺织/.test(n)) return ['化学/物理好', '对实验/研发有兴趣', '耐心细致', '能接受工厂环境'];
      if (/电子|通信|电气/.test(n)) return ['物理/数学好', '动手实验能力强', '对硬件感兴趣', '逻辑清晰'];
      return ['数学/物理好', '逻辑思维强', '动手能力强', '对技术有热情'];
    },
    '理学': (n) => {
      if (/数学/.test(n)) return ['数学天赋好', '喜欢抽象思考', '耐得住寂寞', '有学术追求'];
      if (/物理/.test(n)) return ['物理/数学好', '对自然规律好奇', '实验动手能力强', '有科研理想'];
      if (/化学/.test(n)) return ['化学好', '细心严谨', '实验安全意识到位', '对物质世界好奇'];
      if (/生物/.test(n)) return ['生物/化学好', '对生命科学好奇', '耐心细致', '有科研或医学深造计划'];
      if (/统计/.test(n)) return ['数学好', '对数据敏感', '逻辑清晰', '愿意学编程'];
      if (/心理/.test(n)) return ['对人的行为好奇', '善于倾听', '逻辑分析能力强', '数学中等即可'];
      if (/地理/.test(n)) return ['地理好', '对自然环境感兴趣', '能接受野外考察', '空间思维好'];
      return ['数学/理综好', '喜欢探索规律', '有科研兴趣', '自主学习能力强'];
    },
    '医学': (n) => {
      if (/护理/.test(n)) return ['有耐心和同理心', '动手能力强', '抗压能力好', '生物/化学中等即可'];
      if (/口腔/.test(n)) return ['动手精细', '审美能力好', '沟通能力强', '生物/化学成绩好'];
      if (/药学|中药/.test(n)) return ['化学/生物好', '喜欢实验研究', '细心严谨', '对药物研发感兴趣'];
      return ['生物/化学成绩好', '吃苦耐劳', '有责任心', '不急于快速赚钱'];
    },
    '法学': ['记忆力好', '逻辑表达强', '善于辩论', '对公平正义有追求'],
    '经济学': (n) => {
      if (/金融|投资/.test(n)) return ['数学好', '对市场/商业敏感', '抗压能力强', '目标名校'];
      if (/财政|税务/.test(n)) return ['细心严谨', '数字敏感', '对公共事务有兴趣', '愿意考公'];
      return ['数学中等以上', '对经济现象感兴趣', '逻辑分析能力强', '关注时事'];
    },
    '管理学': (n) => {
      if (/会计|审计|财务管理/.test(n)) return ['细心耐心', '数字敏感', '愿意考证', '数学一般即可'];
      if (/工商管理|市场营销/.test(n)) return ['沟通能力强', '有商业思维', '喜欢与人打交道', '对市场敏感'];
      if (/人力资源|公共管理/.test(n)) return ['善于沟通', '有组织协调能力', '喜欢与人打交道', '耐心细致'];
      return ['沟通能力好', '有组织能力', '对商业/管理有兴趣', '综合素质好'];
    },
    '文学': (n) => {
      if (/汉语言|汉语/.test(n)) return ['语文成绩好', '喜欢阅读写作', '文字功底扎实', '有人文情怀'];
      if (/英语|外语|翻译/.test(n)) return ['语言天赋好', '对跨文化交流感兴趣', '记忆力好', '有出国意愿加分'];
      if (/新闻|传播|广告/.test(n)) return ['好奇心强', '文字表达好', '对热点敏感', '善于沟通'];
      return ['语文/外语好', '喜欢阅读写作', '有人文素养', '表达能力好'];
    },
    '历史学': ['对历史有浓厚兴趣', '记忆力好', '喜欢阅读', '有学术追求'],
    '哲学': ['喜欢深度思考', '阅读量大', '逻辑思维强', '对人生/世界有追问'],
    '教育学': (n) => {
      if (/体育|运动|武术/.test(n)) return ['身体素质好', '运动天赋突出', '喜欢教学', '有耐心'];
      return ['喜欢教学', '有耐心和责任感', '善于沟通', '学科基础扎实'];
    },
    '艺术学': (n) => {
      if (/美术|绘画|设计|书法/.test(n)) return ['艺术天赋好', '审美能力强', '有创造力和想象力', '坚持长期练习'];
      if (/音乐|声乐|乐器/.test(n)) return ['音乐天赋好', '有长期训练基础', '乐感好', '能坚持练习'];
      if (/舞蹈/.test(n)) return ['舞蹈天赋好', '身体素质佳', '有长期训练基础', '有表演欲'];
      if (/戏剧|影视|表演/.test(n)) return ['有表演天赋', '表达能力强', '心理素质好', '外形条件好'];
      return ['艺术特长突出', '有创作热情', '能坚持长期练习', '审美能力好'];
    },
    '农学': (n) => {
      if (/动物|兽医|水产/.test(n)) return ['喜欢动物', '动手能力强', '吃苦耐劳', '生物好'];
      if (/植物|作物|园艺|林学/.test(n)) return ['喜欢大自然', '有耐心', '动手实验能力强', '生物/化学好'];
      return ['对农业/生物有兴趣', '动手能力强', '能接受田间/户外工作', '有科研精神'];
    },
  };

  const rule = rules[cat];
  if (typeof rule === 'function') return rule(name);
  if (Array.isArray(rule)) return rule;
  return ['对本专业有浓厚兴趣', '相关学科基础扎实', '有持续学习意愿'];
}

// ─── 主逻辑 ────────────────────────────────────────

let stats = {
  course_difficulty: 0,
  grad_school_necessity: 0,
  civil_service_fit: 0,
  transfer_difficulty: 0,
  top_employers: 0,
  gender_ratio_filled: 0,
  recommended_for_filled: 0,
};

majors.forEach((major, i) => {
  const { difficultyRules, gradRules, civilRules, transferRules, employerRules } = getRules(major);

  // --- course_difficulty ---
  if (!major.course_difficulty) {
    const d = evalRule(difficultyRules[major.category], major.slug, major.name);
    major.course_difficulty = d || 3;
    stats.course_difficulty++;
  }

  // --- grad_school_necessity ---
  if (!major.grad_school_necessity) {
    const g = evalRule(gradRules[major.category], major.slug, major.name);
    major.grad_school_necessity = g || '建议读研';
    stats.grad_school_necessity++;
  }

  // --- civil_service_fit ---
  if (!major.civil_service_fit) {
    const c = evalRule(civilRules[major.category], major.slug, major.name);
    major.civil_service_fit = c || '以三不限为主';
    stats.civil_service_fit++;
  }

  // --- transfer_difficulty ---
  if (!major.transfer_difficulty) {
    const t = evalRule(transferRules[major.category], major.slug, major.name);
    major.transfer_difficulty = t || '中等';
    stats.transfer_difficulty++;
  }

  // --- top_employers ---
  if (!major.top_employers || major.top_employers.length === 0) {
    const catRules = employerRules[major.category];
    let employers;
    if (catRules) {
      if (typeof catRules === 'object' && !Array.isArray(catRules)) {
        for (const [k, v] of Object.entries(catRules)) {
          if (k === 'default') continue;
          if (new RegExp(k).test(major.name)) {
            employers = v;
            break;
          }
        }
        employers = employers || catRules.default;
      } else {
        employers = catRules;
      }
    }
    major.top_employers = employers || ['相关行业龙头企业', '政府/事业单位', '外资/合资企业'];
    stats.top_employers++;
  }

  // --- gender_ratio (补齐缺失) ---
  if (!major.gender_ratio) {
    major.gender_ratio = fillGenderRatio(major);
    stats.gender_ratio_filled++;
  }

  // --- recommended_for (补齐缺失) ---
  if (!major.recommended_for || major.recommended_for.length === 0) {
    major.recommended_for = fillRecommendedFor(major);
    stats.recommended_for_filled++;
  }
});

// ─── 写出 ───────────────────────────────────────────

fs.writeFileSync(MAJORS_PATH, JSON.stringify(majors, null, 2), 'utf-8');
console.log('✅ 数据增强完成！');
console.log('');
console.log('| 字段 | 新增数 |');
console.log('|------|--------|');
Object.entries(stats).forEach(([k, v]) => {
  console.log(`| ${k} | ${v} |`);
});
console.log(`\n总计新增/补齐: ${Object.values(stats).reduce((a,b)=>a+b,0)} 个字段`);
console.log(`输出: ${MAJORS_PATH}`);
