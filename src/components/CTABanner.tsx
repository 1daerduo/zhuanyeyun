'use client';

import Link from 'next/link';

interface Props {
  variant?: 'compact' | 'full';
}

export default function CTABanner({ variant = 'compact' }: Props) {
  if (variant === 'full') {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white my-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-1">
              想要189个专业的完整数据？
            </h3>
            <p className="text-blue-100 text-sm">
              涵盖薪资趋势、AI风险评估、院校推荐，PDF随身查阅
            </p>
          </div>
          <Link
            href="/buy/"
            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors shrink-0"
          >
            查看完整指南 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/buy/"
      className="block bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl p-4 sm:p-5 my-6 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl shrink-0">📘</span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-700">
            《2026专业报考完整指南》· 189个专业数据
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            薪资趋势 · AI风险评估 · 院校推荐 · 免费试读
          </p>
        </div>
        <span className="text-xs font-medium text-orange-600 bg-white px-2 py-1 rounded shrink-0">
          查看 →
        </span>
      </div>
    </Link>
  );
}
