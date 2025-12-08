'use client';

import Link from 'next/link';
import { motion, MotionConfig } from 'framer-motion';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export default function Navbar({ searchQuery = '', onSearchChange, onSearchSubmit }: NavbarProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect shadow-md"
      >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/标题 */}
          <Link href="/home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-pink-600 cursor-pointer"
            >
              🌸 我的博客
            </motion.div>
          </Link>

          {/* 中间搜索栏 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="搜索文章标题或内容..."
                className="w-full px-4 py-2 rounded-full glass-effect border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* 右侧菜单 */}
          <div className="flex items-center space-x-6">
            <Link href="/home">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-gray-700 hover:text-pink-600 cursor-pointer font-medium transition-colors"
              >
                首页
              </motion.div>
            </Link>
            <Link href="/category">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-gray-700 hover:text-pink-600 cursor-pointer font-medium transition-colors"
              >
                分类
              </motion.div>
            </Link>
            <Link href="/album">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-gray-700 hover:text-pink-600 cursor-pointer font-medium transition-colors"
              >
                相册
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
    </MotionConfig>
  );
}
