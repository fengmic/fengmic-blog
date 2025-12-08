'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface UserInfo {
  name: string;
  avatar: string;
  bio: string;
  email: string;
  qq?: string;
  github?: string;
  motto: string;
}

interface SidebarProps {
  userInfo: UserInfo;
}

export default function Sidebar({ userInfo }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full glass-effect rounded-2xl p-6 shadow-lg"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* 头像 */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg"
        >
          {userInfo.avatar?.startsWith('http') ? (
            <Image
              src={userInfo.avatar}
              alt={userInfo.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-4xl">
              {userInfo.avatar || '🌸'}
            </div>
          )}
        </motion.div>

        {/* 名字 */}
        <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>

        {/* 个人简介 */}
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          {userInfo.bio}
        </p>

        {/* 分隔线 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />

        {/* 联系方式 */}
        <div className="w-full space-y-3">
          {userInfo.email && (
            <InfoItem icon="📧" label="邮箱" value={userInfo.email} />
          )}
          {userInfo.qq && (
            <InfoItem icon="💬" label="QQ" value={userInfo.qq} />
          )}
          {userInfo.github && (
            <InfoItem
              icon="🐙"
              label="GitHub"
              value={userInfo.github}
              link={`https://github.com/${userInfo.github}`}
            />
          )}
        </div>

        {/* 分隔线 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />

        {/* 个人感想 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full p-4 bg-pink-50 rounded-xl"
        >
          <p className="text-sm text-gray-700 italic text-center">
            "{userInfo.motto}"
          </p>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-4xl mt-4"
        >
          🌸
        </motion.div>
      </div>
    </motion.aside>
  );
}

function InfoItem({
  icon,
  label,
  value,
  link,
}: {
  icon: string;
  label: string;
  value: string;
  link?: string;
}) {
  const content = (
    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-pink-50 transition-colors">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-gray-800 font-medium">{value}</div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
