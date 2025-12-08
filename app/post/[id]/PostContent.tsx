'use client';

import { motion } from 'framer-motion';
import { PostData } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostContentProps {
  post: PostData;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8 shadow-lg mb-8"
    >
      {/* 标题 */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>

      {/* 元信息 */}
      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6 pb-6 border-b border-pink-200">
        <span className="flex items-center">
          <span className="mr-2">👤</span>
          {post.author}
        </span>
        <span className="flex items-center">
          <span className="mr-2">📅</span>
          {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
        </span>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full text-sm font-medium text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 内容 */}
      <div
        className="prose prose-pink max-w-none prose-headings:text-pink-600 prose-a:text-blue-500 prose-strong:text-pink-600 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
      />
    </motion.article>
  );
}
