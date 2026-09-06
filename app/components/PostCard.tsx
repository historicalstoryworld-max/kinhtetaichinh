import Link from 'next/link'
import {urlFor} from '@/sanity/image'

export default function PostCard({post}: {post: any}) {
  return (
    <Link
      href={`/bai-viet/${post.slug?.current}`}
      className="block border border-[#D6E9F8] hover:border-[#2F7FE0] transition overflow-hidden group bg-white"
    >
      {post.coverImage && (
        <img
          src={urlFor(post.coverImage).width(300).height(180).url()}
          alt={post.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <span className="text-xs text-[#2F7FE0] font-medium">{post.categoryTitle}</span>
        <h3 className="font-serif text-base font-medium mt-1 group-hover:underline">
          {post.title}
        </h3>
        {post.authorName && (
          <p className="text-xs text-gray-500 mt-2">bởi {post.authorName}</p>
        )}
      </div>
    </Link>
  )
}