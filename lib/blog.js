import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked for GFM (GitHub Flavored Markdown)
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Use absolute path from project root (public/ is always in Docker)
const BLOG_DIR = path.resolve(process.cwd(), 'public/content/blog');

/**
 * Get all blog posts (sorted by date descending)
 */
export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`Blog directory not found: ${BLOG_DIR}`);
    return [];
  }

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
    if (!a.date) return 1;
    if (!b.date) return -1;
    if (a.date < b.date) return 1;
    return -1;
  });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug) {
  if (!slug || typeof slug !== 'string') {
    throw new Error(`Invalid slug: ${slug}`);
  }

  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Simple, reliable Markdown → HTML (no ESM/CJS pipeline issues)
  const contentHtml = marked.parse(content);

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
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`Blog directory not found: ${BLOG_DIR}`);
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  return files.map((filename) => filename.replace(/\.md$/, ''));
}
