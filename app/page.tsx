import Link from 'next/link'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'
import CategoryTabs from './components/CategoryTabs'

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

  return (
    <main>
      {big && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href={`/bai-viet/${big.slug?.current}`}
              className="md:col-span-2 md:row-span-2 block group"
            >
              {big.coverImage && (
                <img
                  src={urlFor(big.coverImage).width(700).height(500).url()}
                  alt={big.title}
                  className="w-full h-72 md:h-full object-cover"
                />
              )}
              <div className="pt-3">
                <span className="text-xs text-[#2F7FE0] border-b border-[#2F7FE0] pb-0.5">
                  {big.categoryTitle}
                </span>
                <h1 className="font-serif text-2xl font-medium mt-2 group-hover:underline">
                  {big.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">bởi {big.authorName}</p>
              </div>
            </Link>

            {small.map((post: any) => (
              <Link key={post.slug?.current} href={`/bai-viet/${post.slug?.current}`} className="block group">
                {post.coverImage && (
                  <img
                    src={urlFor(post.coverImage).width(300).height(180).url()}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="pt-2">
                  <span className="text-xs text-[#2F7FE0]">{post.categoryTitle}</span>
                  <h3 className="font-serif text-sm font-medium mt-1 group-hover:underline">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

            <CategoryTabs categories={categories} posts={posts} />

      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#EAF4FB]">
        <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
          Bạn có thể đã bỏ lỡ
        </h2>
        {missed.length === 0 && (
          <p className="text-sm text-gray-400">Chưa có thêm bài viết nào.</p>
        )}
        <div className="grid md:grid-cols-4 gap-5">
          {missed.map((post: any) => (
            <Link key={post.slug?.current} href={`/bai-viet/${post.slug?.current}`} className="block group">
              {post.coverImage && (
                <img
                  src={urlFor(post.coverImage).width(240).height(160).url()}
                  alt={post.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="pt-2">
                <span className="text-xs text-[#2F7FE0]">{post.categoryTitle}</span>
                <h3 className="font-serif text-sm font-medium mt-1 group-hover:underline">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#EAF4FB]">
        <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
          Bài nổi bật
        </h2>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">
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

      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#EAF4FB]">
        <h2 className="font-serif text-xl font-semibold text-[#0F3D66] mb-6">
          Khám phá chuyên mục
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
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

      <div className="max-w-5xl mx-auto px-6 py-10 border-t border-[#EAF4FB] grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          {rest.map((post: any) => (
            <Link
              key={post.slug?.current}
              href={`/bai-viet/${post.slug?.current}`}
              className="flex gap-6 items-start hover:opacity-80 transition"
            >
              {post.coverImage && (
                <img
                  src={urlFor(post.coverImage).width(240).height(160).url()}
                  alt={post.title}
                  className="w-48 h-32 object-cover flex-shrink-0"
                />
              )}
              <div>
                <span className="text-xs text-[#2F7FE0] border-b border-[#2F7FE0] pb-0.5">
                  {post.categoryTitle}
                </span>
                <h2 className="font-serif text-xl font-medium mt-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mt-1">bởi {post.authorName}</p>
              </div>
            </Link>
          ))}
        </div>

        <aside className="space-y-6">
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
              <div className="flex items-center gap-3 mb-3">
                {author.avatar && (
                  <img
                    src={urlFor(author.avatar).width(112).height(112).url()}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                )}
                <div className="font-serif font-semibold">{author.name}</div>
              </div>
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
        </aside>
      </div>
    </main>
  )
}