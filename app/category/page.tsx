import Navbar from '@/components/Navbar';
import PageEffects from '@/components/PageEffects';
import BackgroundLayer from '@/components/BackgroundLayer';
import CategoryClient from './CategoryClient';
import { getAllPosts, getAllTags } from '@/lib/posts';
import configData from '@/data/config.json';

export default function CategoryPage() {
  const posts = getAllPosts();
  const tagsWithCount = getAllTags();
  const effects = configData?.effects;

  return (
    <div className="min-h-screen pb-8 relative">
      <BackgroundLayer />
      <PageEffects effects={effects} />
      <Navbar />
      
      <CategoryClient posts={posts} tagsWithCount={tagsWithCount} />
    </div>
  );
}
