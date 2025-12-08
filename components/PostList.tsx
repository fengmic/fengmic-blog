'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PostData } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import quotesData from '@/data/quotes.json';

interface PostListProps {
  posts: PostData[];
  selectedTag?: string;
  searchQuery?: string;
}

function PostList({ posts, selectedTag, searchQuery }: PostListProps) {
  const quotes = quotesData.quotes || [
    '每一篇文章，都是时光的印记 ✨',
    '用文字记录生活的美好瞬间 🌸',
  ];
  const [currentQuote, setCurrentQuote] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // 随机切换台词 - 延迟到客户端执行
  useEffect(() => {
    setIsMounted(true);
    
    const updateQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };
    
    updateQuote();
    const timer = setInterval(updateQuote, 7000);
    
    return () => clearInterval(timer);
  }, []);

  // 使用 useMemo 缓存过滤结果
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 标签过滤
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      
      // 搜索过滤（搜索标题、摘要、标签）
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesTag && matchesSearch;
    });
  }, [posts, selectedTag, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 标签/搜索过滤提示 */}
      {(selectedTag || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              {searchQuery ? (
                <>
                  搜索关键词：<span className="font-bold text-pink-600">"{searchQuery}"</span>
                </>
              ) : (
                <>
                  正在筛选标签：<span className="font-bold text-pink-600">#{selectedTag}</span>
                </>
              )}
            </span>
            <span className="text-sm text-gray-500">
              {filteredPosts.length} 篇文章
            </span>
          </div>
        </motion.div>
      )}

      {/* 随机台词 - 只在客户端渲染 */}
      {isMounted && currentQuote && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="glass-effect rounded-2xl p-6 shadow-lg text-center"
          >
            <p className="text-lg text-gray-700 italic">{currentQuote}</p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* 文章列表 */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="glass-effect rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-500">暂无文章 📝</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: PostData }) {
  return (
    <Link href={`/post/${post.id}`}>
      <motion.article
        whileHover={{ scale: 1.02 }}
        className="glass-effect rounded-2xl p-6 shadow-lg cursor-pointer card-hover"
      >
        <div className="space-y-3">
          {/* 标题 */}
          <h2 className="text-2xl font-bold text-gray-800 hover:text-pink-600 transition-colors">
            {post.title}
          </h2>

          {/* 摘要 */}
          <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>

          {/* 元信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="mr-1">👤</span>
                {post.author}
              </span>
              <span className="flex items-center">
                <span className="mr-1">📅</span>
                {format(new Date(post.date), 'yyyy-MM-dd', { locale: zhCN })}
              </span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default memo(PostList);
