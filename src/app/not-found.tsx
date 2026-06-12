import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">页面未找到</h1>
      <p className="text-gray-500 mb-8">你要找的专业页面可能尚未收录，或链接已过期。</p>
      <Link href="/" className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
        返回首页
      </Link>
    </div>
  );
}
