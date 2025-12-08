import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BackgroundLayer from '@/components/BackgroundLayer';
import PageEffects from '@/components/PageEffects';
import { getAllPostIds, getPostData } from '@/lib/posts';
import PostContent from './PostContent';
import configData from '@/data/config.json';

// 生成静态路径
export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts.map((post) => ({
    id: post.id,
  }));
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const post = await getPostData(id);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  let post;
  
  try {
    post = await getPostData(id);
  } catch (error) {
    notFound();
  }

  const effects = configData?.effects;

  return (
    <div className="min-h-screen pb-8 relative">
      <BackgroundLayer />
      <PageEffects effects={effects} />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-24">
        <PostContent post={post} />
      </div>
    </div>
  );
}
