// @flow strict
import { getAllPosts } from '@/lib/blog';
import { personalData } from '@/utils/data/personal-data';
import BlogCard from '../components/homepage/blog/blog-card';
import Link from 'next/link';
import { FaBookOpen } from 'react-icons/fa';

async function getDevToBlogs() {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${personalData.devUsername}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getBlogs() {
  const [localPosts, devToPosts] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getDevToBlogs(),
  ]);

  // Merge and dedupe: local posts first, then Dev.to posts
  const localWithSource = localPosts.map((post) => ({
    ...post,
    source: 'local',
    url: `/blog/${post.slug}`,
    reading_time_minutes: parseInt(post.read_time) || 5,
  }));

  const devToWithSource = (devToPosts || [])
    .filter((post) => post.cover_image)
    .map((post) => ({
      ...post,
      source: 'devto',
    }));

  // Combine: local posts (which already have cover_image or not) + devto posts with cover_image
  return [...localWithSource, ...devToWithSource];
}

async function page() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#0f0d24] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <FaBookOpen size={24} className="text-violet-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Blog</h1>
          </div>
          <p className="text-[#a0a5c0] text-center max-w-xl">
            Thoughts on DevOps, Cloud Infrastructure, and Software Engineering
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
          {blogs.map((blog, i) => (
            <BlogCard blog={blog} key={i} priority={i < 3} />
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20 text-[#a0a5c0]">
            <p className="text-lg">No blog posts yet.</p>
            <p className="text-sm mt-2">
              Add Markdown files to{' '}
              <code className="text-violet-400">content/blog/</code> to get started.
            </p>
          </div>
        )}

        {/* Write new post CTA */}
        <div className="mt-16 p-6 rounded-xl border border-[#2a2d4a] bg-[#1b203e] text-center">
          <h3 className="text-white font-semibold text-lg mb-2">
            Write a New Blog Post
          </h3>
          <p className="text-[#a0a5c0] text-sm mb-4">
            Create a new Markdown file in{' '}
            <code className="text-violet-400 bg-[#0f0d24] px-2 py-1 rounded">
              content/blog/
            </code>
          </p>
          <div className="bg-[#0f0d24] rounded-lg p-4 text-left max-w-lg mx-auto">
            <p className="text-[#a0a5c0] text-xs font-semibold mb-2 uppercase tracking-wider">
              Example: content/blog/my-first-post.md
            </p>
            <pre className="text-[#16f2b3] text-xs overflow-x-auto">
{`---
title: "My First Blog Post"
description: "A brief description of the post"
date: "2025-07-23"
tags: ["DevOps", "Kubernetes"]
author: "Edi Riyanto"
read_time: "5 min read"
published: true
---

# My First Blog Post

Your content here...`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
