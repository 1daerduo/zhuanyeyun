import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '使用条款 - 专业就业通',
  description: '专业就业通（zhuanyeyun.com）使用条款与免责声明',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">使用条款与免责声明</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>最后更新：2026年6月12日</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">免责声明</h2>
        <p>本网站（zhuanyeyun.com）提供的专业就业数据和分析内容，均基于公开数据渠道收集整理，不作任何明示或暗示的保证。数据可能存在滞后或偏差，仅供信息参考，不构成任何形式的专业报考建议或就业承诺。用户依据本网站信息做出的任何决策，由用户自行承担相应风险。</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">数据准确性</h2>
        <p>我们尽力确保数据的准确性和时效性，但不保证完全准确。薪资数据为行业平均水平，个体差异可能显著。就业率统计口径可能因学校和统计方法不同而存在差异。</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">知识产权</h2>
        <p>本网站的原创内容（包括文案、数据结构设计、分析模型）受著作权保护。未经授权，禁止转载或用于商业用途。引用公开数据形成的分析结论，请注明出处。</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">外部链接</h2>
        <p>本网站可能包含指向第三方网站的链接，我们对第三方网站的内容和隐私政策不负责任。</p>
      </div>
    </div>
  );
}
