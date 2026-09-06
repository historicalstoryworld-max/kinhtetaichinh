'use client'

import {useState} from 'react'
import Link from 'next/link'
import {urlFor} from '@/sanity/image'

type Post = {
  title: string
  slug: {current: string}
  coverImage: any
  categoryTitle: string
}

export default function CategoryTabs({
  categories,
  posts,
}: {
  categories: {title: string; slug: string}[]
  posts: Post[]
}) {
  const [active, setActive] = useState(categories[0]?.title || '')

  const filtered = posts.filter((p) => p.categoryTitle === active)

  return (
    <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#EAF4FB]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-semibold text-[#0F3D66]">
          Quanh bạn nên biết
        </h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActive(cat.title)}
              className={
                'text-sm px-4 py-1.5 rounded-full border ' +
                (active === cat.title
                  ? 'bg-[#2F7FE0] text-white border-[#2F7FE0]'
                  : 'bg-white text-[#0F3D66] border-[#D6E9F8]')
              }
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400">Chưa có bài viết nào trong chuyên mục này.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Link key={post.slug?.current} href={`/bai-viet/${post.slug?.current}`} className="block group">
            {post.coverImage && (
              <img
                src={urlFor(post.coverImage).width(300).height(180).url()}
                alt={post.title}
                className="w-full h-36 object-cover"
              />
            )}
            <h3 className="font-serif text-base font-medium mt-2 group-hover:underline">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}