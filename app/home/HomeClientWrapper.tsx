'use client';

import { useState, useCallback } from 'react';
import PostList from '@/components/PostList';
import RightSidebar from '@/components/RightSidebar';
import Navbar from '@/components/Navbar';
import { PostData } from '@/lib/posts';

interface HomeClientWrapperProps {
  posts: PostData[];
  topTags: string[];
  images: string[];
}

export default function HomeClientWrapper({ posts, topTags, images }: HomeClientWrapperProps) {
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(prevTag => prevTag === tag ? undefined : tag);
    setSearchQuery(''); // 清除搜索
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSelectedTag(undefined); // 清除标签过滤
    }
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // 搜索时自动触发过滤
  }, []);

  return (
    <>
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <PostList 
        posts={posts} 
        selectedTag={selectedTag} 
        searchQuery={searchQuery}
      />
      <div className="fixed right-4 top-24 w-1/5">
        <RightSidebar
          images={images}
          tags={topTags}
          onTagClick={handleTagClick}
        />
      </div>
    </>
  );
}
