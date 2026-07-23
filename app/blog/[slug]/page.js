// @flow strict
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  return {
    title: `${post.title} | Edi Riyanto Blog`,
    description: post.description,
  };
}

async function BlogPost({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  return (
    <div className="min-h-screen bg-[#0f0d24] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#16f2b3] hover:text-violet-400 transition-colors mb-8 no-underline"
        >
          <FaArrowLeft size={16} />
          <span>Back to Blog</span>
        </Link>

        {/* Cover image */}
        {post.cover_image && (
          <div className="rounded-xl overflow-hidden mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-[#a0a5c0] text-sm mb-6">
          <span className="flex items-center gap-2">
            <FaCalendarAlt size={14} />
            {post.date}
          </span>
          <span className="flex items-center gap-2">
            <FaClock size={14} />
            {post.read_time || '5 min read'}
          </span>
          <span className="flex items-center gap-2">
            <FaUser size={14} />
            {post.author || 'Edi Riyanto'}
          </span>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-violet-600/20 text-violet-300 rounded-full border border-violet-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent mb-8" />

        {/* Article content */}
        <article
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#d3d8e8] prose-p:leading-relaxed prose-p:mb-5
            prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-[#16f2b3] prose-code:bg-[#1b203e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-[#1b203e] prose-pre:border prose-pre:border-[#2a2d4a] prose-pre:rounded-lg prose-pre:p-5
            prose-li:text-[#d3d8e8] prose-li:mb-2
            prose-blockquote:border-l-violet-500 prose-blockquote:text-[#a0a5c0] prose-blockquote:not-italic
            prose-strong:text-white prose-strong:font-semibold
            prose-img:rounded-xl prose-img:border prose-img:border-[#2a2d4a]
            prose-hr:border-[#2a2d4a]"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Footer divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent mt-12 mb-8" />

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#16f2b3] hover:text-violet-400 transition-colors no-underline"
          >
            <FaArrowLeft size={16} />
            <span>Back to all posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
