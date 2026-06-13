'use client';

import { useState } from 'react';
import type { AffiliateProduct } from '@/lib/affiliate';
import { getAffiliateLink, getPlatformName } from '@/lib/affiliate';

interface Props {
  intro: string;
  products: AffiliateProduct[];
}

export default function AffiliateCard({ intro, products }: Props) {
  const [expanded, setExpanded] = useState(false);
  const displayProducts = expanded ? products : products.slice(0, 4);

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📚</span>
        <h2 className="text-lg font-bold text-gray-900">推荐学习资源</h2>
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">广告</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{intro}</p>

      {products.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">推广链接收集中，敬请期待</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayProducts.map((product, idx) => {
            const link = getAffiliateLink(product);
            const cardContent = (
              <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                  📖
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      {product.tag}
                    </span>
                    <span className="text-xs text-gray-400">{getPlatformName(product.platform)}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{product.desc}</p>
                  <p className="text-sm font-bold text-orange-600 mt-1">{product.price}</p>
                </div>
              </div>
            );

            if (!link) return <div key={idx}>{cardContent}</div>;

            return (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="nofollow noopener sponsored"
                className="hover:border-orange-300 hover:shadow-sm transition-all group"
              >
                {cardContent}
              </a>
            );
          })}
        </div>
      )}

      {products.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full text-center text-sm text-orange-600 hover:text-orange-800 font-medium py-2 rounded-lg hover:bg-orange-100/50 transition-colors"
        >
          {expanded ? '收起 ∧' : `展开全部 ${products.length} 个推荐 ∨`}
        </button>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        以上链接为第三方平台商品推荐，点击后将跳转至对应平台查看详情
      </p>
    </section>
  );
}
