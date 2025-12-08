import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageEffects from '@/components/PageEffects';
import BackgroundLayer from '@/components/BackgroundLayer';
import { getAllPosts, getTopTags } from '@/lib/posts';
import configData from '@/data/config.json';
import carouselData from '@/data/carousel.json';
import HomeClientWrapper from './HomeClientWrapper';

export default function HomePage() {
  // 服务端获取静态数据
  const posts = getAllPosts();
  const topTagsData = getTopTags(9);
  const topTags = topTagsData.map(t => t.tag);

  const userInfo = configData?.userInfo || {
    name: '楓念',
    avatar: '🌸',
    bio: '一个喜欢捣鼓各种新东西的牢二次元，GALGAME糕手，代码CV工程师；分析一些自己喜欢的东西。',
    email: 'fengmic103@163.com',
    qq: '1850574216',
    github: 'yourusername',
    motto: '做个悠然的普通人~',
  };

  const images = carouselData?.images || ['🌸', '🌺', '🌼', '🌻', '🌷'];
  const background = configData?.background;
  const effects = configData?.effects;

  return (
    <div className="min-h-screen pb-8 relative">
      <BackgroundLayer />
      <PageEffects effects={effects} />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="flex gap-6">
          {/* 左侧边栏 - 20% */}
          <div className="w-1/5 sticky top-24 h-fit">
            <Sidebar userInfo={userInfo} />
          </div>

          {/* 中间内容区 - 60% */}
          <div className="w-3/5">
            <HomeClientWrapper posts={posts} topTags={topTags} images={images} />
          </div>

          {/* 右侧边栏 - 20% */}
          <div className="w-1/5 sticky top-24 h-fit">
            {/* RightSidebar 现在在 HomeClientWrapper 中 */}
          </div>
        </div>
      </div>
    </div>
  );
}
