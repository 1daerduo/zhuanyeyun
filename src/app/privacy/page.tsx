import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策 - 专业就业通',
  description: '专业就业通（zhuanyeyun.com）隐私政策',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">隐私政策</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>最后更新：2026年6月12日</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">一、信息收集</h2>
        <p>本网站为纯静态内容站点，不收集任何个人身份信息。我们使用以下第三方服务：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Cloudflare Analytics（匿名访问统计，不含个人身份信息）</li>
          <li>百度统计（匿名访问分析）</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">二、Cookie 使用</h2>
        <p>本网站使用必要的技术 Cookie 保证网站正常运行。我们不使用追踪 Cookie 或广告 Cookie。</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">三、数据来源声明</h2>
        <p>本网站展示的专业就业数据来源于各高校毕业生就业质量年度报告、教育部学职平台、麦可思《中国大学生就业蓝皮书》、国家统计局公开数据等公开渠道。数据仅供信息参考，不构成专业报考建议。</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">四、联系方式</h2>
        <p>如有任何隐私相关问题，请联系：admin@zhuanyeyun.com</p>
      </div>
    </div>
  );
}
