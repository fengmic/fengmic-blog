'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

// 预生成固定的星星位置，避免水合错误
const generateStarPositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      left: (i * 7.3 + 13.7) % 100, // 伪随机但固定的位置
      top: (i * 11.2 + 27.4) % 100,
      duration: 2 + (i % 3),
      delay: (i % 5) * 0.4,
    });
  }
  return positions;
};

const STAR_POSITIONS = generateStarPositions(50);

// 预生成流星位置
const generateMeteorPositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      startX: 100 + (i * 13.7) % 50,
      startY: -20 + (i * 17.3) % 40,
      endX: -20 + (i * 7.9) % 20,
      endY: 100 + (i * 11.1) % 20,
      duration: 1 + (i % 3) * 0.3,
      delay: (i * 2.7) % 3,
      repeatDelay: 3 + (i * 1.9) % 5,
    });
  }
  return positions;
};

const METEOR_POSITIONS = generateMeteorPositions(5);

export default function HomePage() {
  const router = useRouter();
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    // 立即开始预加载首页
    setIsPreloading(true);
    
    // 使用 Next.js 的 prefetch API 预加载路由（这是最重要的）
    router.prefetch('/home');
    
    // 预加载首页文档
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.as = 'document';
    preloadLink.href = '/home';
    document.head.appendChild(preloadLink);

    // 在动画后期（4秒时）创建隐藏的 iframe 完全加载首页
    const iframeTimer = setTimeout(() => {
      const iframe = document.createElement('iframe');
      iframe.src = '/home';
      iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none;';
      iframe.id = 'preload-frame';
      document.body.appendChild(iframe);
    }, 4000); // 在动画结束前1.5秒开始加载

    // 动画结束时间点跳转
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5500); // 文字3秒 + 淡出2.5秒

    return () => {
      clearTimeout(timer);
      clearTimeout(iframeTimer);
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
      const iframe = document.getElementById('preload-frame');
      if (iframe && iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    };
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      {/* 星空背景 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
        }}
      >
        {/* 星星 - 使用固定位置避免水合错误 */}
        {STAR_POSITIONS.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0.5, 1],
              scale: [0, 1, 1, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              boxShadow: '0 0 3px #fff',
            }}
          />
        ))}
      </motion.div>

      {/* 背景淡出动画 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1] }}
        transition={{ duration: 5.5, times: [0, 0.55, 0.73, 1] }}
        className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50"
      />

      {/* 文字内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          y: [20, 0, 0, -20]
        }}
        transition={{ 
          duration: 5.5,
          times: [0, 0.18, 0.55, 1]
        }}
        className="relative z-10 text-center space-y-8"
      >
        {/* 中文标题 */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-pink-100 to-purple-200 mb-2"
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.5)',
              fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
            }}
          >
            欢迎来到 楓念 的博客~
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg text-gray-300 italic"
          >
            Welcome to Fengmic's Blog~
          </motion.p>
        </div>

        {/* 副标题 */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-3xl font-medium text-pink-100"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.3)',
            }}
          >
            这是一个兴趣使然的小站
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-base text-gray-400 italic mt-1"
          >
            A place driven by passion and interest
          </motion.p>
        </div>

        {/* 装饰性元素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex justify-center space-x-4 text-3xl"
        >
          <motion.span
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌸
          </motion.span>
          <motion.span
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            ✨
          </motion.span>
        </motion.div>
      </motion.div>

      {/* 流星效果 - 使用固定位置避免水合错误 */}
      {METEOR_POSITIONS.map((meteor, i) => (
        <motion.div
          key={`meteor-${i}`}
          initial={{ 
            x: `${meteor.startX}%`,
            y: `${meteor.startY}%`,
            opacity: 0
          }}
          animate={{
            x: `${meteor.endX}%`,
            y: `${meteor.endY}%`,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            repeatDelay: meteor.repeatDelay,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.8)',
          }}
        />
      ))}
    </div>
  );
}
