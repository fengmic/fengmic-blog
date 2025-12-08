'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PostData } from '@/lib/posts';

interface CategoryClientProps {
  posts: PostData[];
  tagsWithCount: { tag: string; count: number }[];
}

export default function CategoryClient({ posts, tagsWithCount }: CategoryClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 按标签分组文章
  const tagToPosts = useMemo(() => {
    const map = new Map<string, PostData[]>();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (!map.has(tag)) {
          map.set(tag, []);
        }
        map.get(tag)!.push(post);
      });
    });
    return map;
  }, [posts]);

  const selectedTagData = useMemo(() => {
    if (!selectedTag) return null;
    const posts = tagToPosts.get(selectedTag) || [];
    const count = tagsWithCount.find(t => t.tag === selectedTag)?.count || 0;
    return { tag: selectedTag, count, posts };
  }, [selectedTag, tagToPosts, tagsWithCount]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(tag);
  }, []);

  const handleBackToAll = useCallback(() => {
    setSelectedTag(null);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      {/* 标题区 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏷️ 文章分类</h1>
        <p className="text-gray-600">
          共 {tagsWithCount.length} 个分类，{posts.length} 篇文章
        </p>
      </motion.div>

      {/* 标签云 */}
      {!selectedTag && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">☁️</span>
            标签云
          </h2>
          <div className="flex flex-wrap gap-4">
            {tagsWithCount.map((stat, index) => {
              const sizeClass = stat.count >= 5 ? 'text-3xl' : stat.count >= 3 ? 'text-2xl' : 'text-xl';
              const colorClass =
                stat.count >= 5
                  ? 'from-pink-400 to-purple-400'
                  : stat.count >= 3
                  ? 'from-blue-400 to-cyan-400'
                  : 'from-green-400 to-teal-400';

              return (
                <motion.button
                  key={stat.tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTagClick(stat.tag)}
                  className={`${sizeClass} px-6 py-3 bg-gradient-to-r ${colorClass} text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                >
                  <span className="drop-shadow-lg">#{stat.tag}</span>
                  <span className="ml-2 text-sm opacity-90">({stat.count})</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 分类列表 */}
      {!selectedTag && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tagsWithCount.map((stat, index) => {
            const tagPosts = tagToPosts.get(stat.tag) || [];
            return (
              <motion.div
                key={stat.tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTagClick(stat.tag)}
                className="glass-effect rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                    #{stat.tag}
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm font-bold">
                    {stat.count} 篇
                  </span>
                </div>

                <div className="space-y-2">
                  {tagPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="text-sm text-gray-600 truncate hover:text-pink-600 transition-colors"
                    >
                      • {post.title}
                    </div>
                  ))}
                  {stat.count > 3 && (
                    <div className="text-xs text-gray-400">还有 {stat.count - 3} 篇文章...</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 选中标签的文章列表 */}
      {selectedTag && selectedTagData && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-6">
            <button
              onClick={handleBackToAll}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              ← 返回分类列表
            </button>
          </div>

          <div className="glass-effect rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏷️</span>#{selectedTag}
            </h2>
            <p className="text-gray-600">共 {selectedTagData.count} 篇文章</p>
          </div>

          <div className="space-y-6">
            {selectedTagData.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/post/${post.id}`}>
                  <div className="glass-effect rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>✍️ {post.author}</span>
                      </div>
                      <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tag === selectedTag
                              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                              : 'bg-pink-100 text-pink-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 空状态 */}
      {tagsWithCount.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-gray-500 text-lg">还没有文章分类</p>
        </div>
      )}
    </div>
  );
}
