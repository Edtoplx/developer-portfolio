import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Get all blog posts (sorted by date descending)
 */
export function getAllPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    };
  });

  // Sort by date descending
  return posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...data,
  };
}

/**
 * Get all post slugs (for static generation)
 */
export function getAllSlugs() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  return files.map((filename) => filename.replace(/\.md$/, ''));
}
