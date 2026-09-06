import Link from 'next/link'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'
import CategoryTabs from './components/CategoryTabs'
import PostCard from './components/PostCard'

async function getPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc){
    title,
    slug,
    coverImage,
    "categoryTitle": category->title,
    "authorName": author->name
  }`)
}

async function getAuthor() {
  return client.fetch(`*[_type == "author"][0]{name, bio, avatar}`)
}

async function getCategories() {
  return client.fetch(`*[_type == "category"]{
    title,
    "slug": slug.current,
    "postCount": count(*[_type == "post" && references(^._id)])
  } | order(title asc)`)
}

export default async function Home() {
  const posts = await getPosts()
  const author = await getAuthor()
  const categories = await getCategories()

  const hero = posts.slice(0, 5)
  const afterHero = posts.slice(5)
  const [big, ...small] = hero

  const missed = afterHero.slice(0, 4)
  const rest = afterHero.slice(4)
  const trending = posts.slice(0, 5)
  const recentPosts = posts.slice(0, 3)

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">
      <aside className="md:col-span-1 space-y-6 order-1">
        <div className="bg-[#F7FBFE] border border-[#D6E9F8] p-6">
          <h4 className="font-serif font-semibold mb-3 pb-2 border-b border-[#D6E9F8]">
            Tìm kiếm
          </h4>
          <div className="flex items-center border border-[#D6E9F8] bg-white px-3 py-2">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              disabled
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
            <span className="text-[#2F7FE0]">🔍</span>
          </div>
        </div>

        {author && (
          <div className="bg-[#F7FBFE] border border-[#D6E9F8] p-6">
            <h4 className="font-serif font-semibold mb-3 pb-2 border-b border-[#D6E9F8]">
              Giới thiệu
            </h4>
            <div className="font-serif font-semibold mb-1">{author.name}</div>
            {author.bio && <p className="text-sm text-gray-600">{author.bio}</p>}
          </div>
        )}

        <div className="bg-[#F7FBFE] border border-[#D6E9F8] p-6">
          <h4 className="font-serif font-semibold mb-3 pb-2 border-b border-[#D6E9F8]">
            Chuyên mục
          </h4>
          {categories.map((cat: any) =>
            cat.slug ? (
              <Link
                key={cat.slug}
                href={`/chuyen-muc/${cat.slug}`}
                className="block py-2 text-sm border-b border-[#D6E9F8] last:border-none hover:text-[#2F7FE0]"
              >
                {cat.title}
              </Link>
            ) : null
          )}
        </div>

        <div className="bg-[#F7FBFE] border border-[#D6E9F8] p-6">
          <h4 className="font-serif font-semibold mb-3 pb-2 border-b border-[#D6E9F8]">
            Bài viết gần đây
          </h4>
          {recentPosts.map((post: any) => (
            <Link
              key={post.slug?.current}
              href={`/bai-viet/${post.slug?.current}`}
              className="flex gap-3 py-3 border-b border-[#D6E9F8] last:border-none"
            >
              {post.coverImage && (
                <img
                  src={urlFor(post.coverImage).width(112).height(112).url()}
                  alt=""
                  className="w-14 h-14 object-cover flex-shrink-0"
                />
              )}
              <div>
                <h5 className="text-sm font-medium leading-tight">{post.title}</h5>
                <span className="text-xs text-gray-500">{post.authorName}</span>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      <div className="md:col-span-3 order-2 space-y-14">
        {big && (
          <section className={small.length > 0 ? 'grid md:grid-cols-4 gap-4' : ''}>
            <div className={small.length > 0 ? 'md:col-span-2 md:row-span-2' : ''}>
              <PostCard post={big} />
            </div>
            {small.map((post: any) => (
              <PostCard key={post.slug?.current} post={post} />
            ))}
          </section>
        )}

        <CategoryTabs categories={categories} posts={posts} />

        <section className="border-t border-[#EAF4FB] pt-10">
          <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
            Bạn có thể đã bỏ lỡ
          </h2>
          {missed.length === 0 && (
            <p className="text-sm text-gray-400">Chưa có thêm bài viết nào.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-5">
            {missed.map((post: any) => (
              <PostCard key={post.slug?.current} post={post} />
            ))}
          </div>
        </section>

        <section className="border-t border-[#EAF4FB] pt-10">
          <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
            Bài nổi bật
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {trending.map((post: any, i: number) => (
              <Link
                key={post.slug?.current}
                href={`/bai-viet/${post.slug?.current}`}
                className="flex items-center gap-3 group"
              >
                <span
                  className={
                    'font-serif text-lg font-semibold w-9 h-9 flex items-center justify-center flex-shrink-0 rounded ' +
                    (i === 0 ? 'bg-[#2F7FE0] text-white' : 'border border-[#D6E9F8] text-[#2F7FE0]')
                  }
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium group-hover:underline">{post.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-[#EAF4FB] pt-10">
          <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
            Khám phá chuyên mục
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((cat: any) =>
              cat.slug ? (
                <Link
                  key={cat.slug}
                  href={`/chuyen-muc/${cat.slug}`}
                  className="relative h-32 flex items-end p-4 bg-gradient-to-br from-[#2F7FE0] to-[#0F3D66] text-white group"
                >
                  <div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {cat.postCount} bài
                    </span>
                    <h3 className="font-serif font-semibold mt-1 group-hover:underline">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </section>

        {rest.length > 0 && (
          <section className="border-t border-[#EAF4FB] pt-10">
            <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
              Tất cả bài viết
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {rest.map((post: any) => (
                <PostCard key={post.slug?.current} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}