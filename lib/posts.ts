import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  author: string;
  content?: string;
  htmlContent?: string;
}

/**
 * 获取所有文章的 ID 列表
 */
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      id: fileName.replace(/\.md$/, ''),
    }));
}

/**
 * 获取所有文章数据（不包含内容）
 */
export function getAllPosts(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id,
        title: data.title || '无标题',
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        author: data.author || 'Anonymous',
      };
    });

  // 按日期排序（新的在前）
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * 根据 ID 获取单篇文章的完整数据（包含 HTML 内容）
 */
export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 使用 gray-matter 解析 frontmatter
  const { data, content } = matter(fileContents);

  // 使用 remark 将 Markdown 转换为 HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const htmlContent = processedContent.toString();

  return {
    id,
    title: data.title || '无标题',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    excerpt: data.excerpt || '',
    author: data.author || 'Anonymous',
    content,
    htmlContent,
  };
}

/**
 * 根据标签获取文章列表
 */
export function getPostsByTag(tag: string): PostData[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

/**
 * 获取所有标签及其文章数量
 */
export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagMap = new Map<string, number>();

  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 获取最热门的 N 个标签
 */
export function getTopTags(limit: number = 9): { tag: string; count: number }[] {
  return getAllTags().slice(0, limit);
}
