'use client'

import {useState} from 'react'
import PostCard from './PostCard'

type Post = {
  title: string
  slug: {current: string}
  coverImage: any
  categoryTitle: string
  authorName?: string
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
    <section className="border-t border-[#EAF4FB] pt-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
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

      <div className="grid sm:grid-cols-2 gap-6">
        {filtered.map((post) => (
          <PostCard key={post.slug?.current} post={post} />
        ))}
      </div>
    </section>
  )
}