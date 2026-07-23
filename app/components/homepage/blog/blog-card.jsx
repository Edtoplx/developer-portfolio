// @flow strict
import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { BsHeartFill } from 'react-icons/bs';
import { FaCommentAlt } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';

function BlogCard({ blog, priority = false }) {
  const isLocal = blog.source === 'local';
  const isDevTo = blog.source === 'devto' || !isLocal;
  const readTime = isLocal
    ? blog.read_time || '5 min read'
    : `${blog.reading_time_minutes} Min Read`;

  return (
    <div className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group"
    >
      {blog?.cover_image && (
        <div className="h-44 lg:h-52 w-auto cursor-pointer overflow-hidden rounded-t-lg">
          <Image
            src={blog.cover_image}
            height={1080}
            width={1920}
            className='h-full w-full group-hover:scale-110 transition-all duration-300'
            alt=""
            priority={priority}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
      <div className="p-2 sm:p-3 flex flex-col">
        <div className="flex justify-between items-center text-[#16f2b3] text-sm">
          <p>{isLocal ? blog.date : timeConverter(blog.published_at)}</p>
          <div className="flex items-center gap-3">
            {isDevTo && blog.public_reactions_count >= 0 && (
              <p className="flex items-center gap-1">
                <BsHeartFill />
                <span>{blog.public_reactions_count}</span>
              </p>
            )}
            {isDevTo && blog.comments_count > 0 && (
              <p className="flex items-center gap-1">
                <FaCommentAlt />
                <span>{blog.comments_count}</span>
              </p>
            )}
            {isLocal && (
              <span className="flex items-center gap-1 text-xs bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">
                Local
              </span>
            )}
          </div>
        </div>
        <Link
          target={isLocal ? '_self' : '_blank'}
          rel={isLocal ? undefined : 'noopener noreferrer'}
          href={blog.url}
        >
          <p className='my-2 lg:my-3 cursor-pointer text-lg text-white sm:text-xl font-medium hover:text-violet-500 flex items-center gap-2'>
            {blog.title}
            {isDevTo && <FaExternalLinkAlt size={12} />}
          </p>
        </Link>
        <p className='mb-2 text-sm text-[#16f2b3]'>
          {readTime}
        </p>
        <p className='text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 line-clamp-3'>
          {blog.description}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;