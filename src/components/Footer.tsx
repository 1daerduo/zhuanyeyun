import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">专业就业通</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              用数据帮你选专业。<br />
              涵盖883个本科专业的就业分析。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">热门专业</h4>
            <ul className="space-y-2">
              <li><Link href="/major/jisuanji-kexue-yu-jishu" className="text-sm text-gray-500 hover:text-blue-600">计算机科学与技术</Link></li>
              <li><Link href="/major/ruanjian-gongcheng" className="text-sm text-gray-500 hover:text-blue-600">软件工程</Link></li>
              <li><Link href="/major/rengong-zhineng" className="text-sm text-gray-500 hover:text-blue-600">人工智能</Link></li>
              <li><Link href="/major/linchuang-yixue" className="text-sm text-gray-500 hover:text-blue-600">临床医学</Link></li>
              <li><Link href="/major/kouqiang-yixue" className="text-sm text-gray-500 hover:text-blue-600">口腔医学</Link></li>
              <li><Link href="/major/jinrong-xue" className="text-sm text-gray-500 hover:text-blue-600">金融学</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">排行与工具</h4>
            <ul className="space-y-2">
              <li><Link href="/ranking/gaoxin" className="text-sm text-gray-500 hover:text-blue-600">高薪专业排行榜</Link></li>
              <li><Link href="/ranking/jiuye" className="text-sm text-gray-500 hover:text-blue-600">就业率排行榜</Link></li>
              <li><Link href="/ranking/ai-safe" className="text-sm text-gray-500 hover:text-blue-600">AI抗风险专业榜</Link></li>
              <li><Link href="/tools/compare" className="text-sm text-gray-500 hover:text-blue-600">专业对比器</Link></li>
              <li><Link href="/tools/salary" className="text-sm text-gray-500 hover:text-blue-600">薪资计算器</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">关于本站</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">隐私政策</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">使用条款</Link></li>
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              数据来源：各高校毕业生就业质量报告、<br />
              麦可思大学生就业蓝皮书、学职平台等。<br />
              数据仅供参考，不构成报考建议。
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} zhuanyeyun.com 专业就业通 — 数据驱动的大学专业选择平台
          </p>
        </div>
      </div>
    </footer>
  );
}
