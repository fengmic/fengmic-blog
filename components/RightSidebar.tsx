'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightSidebarProps {
  images: string[];
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function RightSidebar({ images, tags, onTagClick }: RightSidebarProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 初始化客户端状态
  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(new Date());
  }, []);

  // 图片轮播
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3秒轮播
    return () => clearInterval(timer);
  }, [images]);

  // 更新日期 - 只在客户端运行
  useEffect(() => {
    if (!isMounted) return;
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 每分钟更新一次
    return () => clearInterval(timer);
  }, [isMounted]);

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full space-y-6"
    >
      {/* 图片展示区 */}
      <div className="glass-effect rounded-2xl p-4 shadow-lg overflow-hidden">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🖼️</span>
          图片展示
        </h3>
        <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200">
          <AnimatePresence mode="wait">
            {images.length > 0 ? (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                {images[currentImageIndex]?.startsWith('http') ? (
                  <img 
                    src={images[currentImageIndex]} 
                    alt="轮播图片" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {images[currentImageIndex] || '🌸'}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🌸
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 二次元日历 - 只在客户端渲染 */}
      {isMounted && currentDate && <AnimeCalendar date={currentDate} />}

      {/* 文章归档 */}
      <div className="glass-effect rounded-2xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🏷️</span>
          文章归档
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick?.(tag)}
              className="px-3 py-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full text-sm font-medium text-gray-700 hover:from-pink-300 hover:to-purple-300 transition-all shadow-sm"
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

function AnimeCalendar({ date }: { date: Date }) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="glass-effect rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center">
        <span className="mr-2">📅</span>
        {monthNames[date.getMonth()]}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-xs font-bold text-pink-600 py-1">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <motion.div
            key={index}
            whileHover={day ? { scale: 1.2 } : {}}
            className={`text-xs py-1 rounded ${
              day === date.getDate()
                ? 'bg-pink-400 text-white font-bold'
                : day
                ? 'text-gray-700 hover:bg-pink-100'
                : ''
            }`}
          >
            {day || ''}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
