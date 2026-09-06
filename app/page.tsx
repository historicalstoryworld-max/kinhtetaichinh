import Link from 'next/link'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'

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
  return client.fetch(`*[_type == "category"]{title, "slug": slug.current} | order(title asc)`)
}

export default async function Home() {
  const posts = await getPosts()
  const author = await getAuthor()
  const categories = await getCategories()
  const [featured, ...rest] = posts

  return (
    <main>
      {featured && (
        <section className="bg-[#1B2A4A] text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-end">
            <div>
              <h1 className="font-serif text-4xl font-medium leading-tight max-w-md">
                Hiểu tiền của mình, trước khi tiền quyết định thay mình.
              </h1>
              <p className="mt-4 opacity-75 max-w-sm">
                Những bài viết ngắn, dễ hiểu về ngân sách, tiết kiệm và đầu tư.
              </p>
            </div>
            <Link href={`/bai-viet/${featured.slug?.current}`} className="block bg-white text-[#1E2430] hover:opacity-90 transition">
              {featured.coverImage && (
                <img
                  src={urlFor(featured.coverImage).width(600).height(360).url()}
                  alt={featured.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <span className="text-xs text-[#2F6B62] border-b border-[#2F6B62] pb-0.5">
                  {featured.categoryTitle}
                </span>
                <h3 className="font-serif text-lg font-medium mt-2">{featured.title}</h3>
              </div>
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12">
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
                <span className="text-xs text-[#2F6B62] border-b border-[#2F6B62] pb-0.5">
                  {post.categoryTitle}
                </span>
                <h2 className="font-serif text-xl font-medium mt-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mt-1">bởi {post.authorName}</p>
              </div>
            </Link>
          ))}
        </div>

        <aside className="space-y-6">
          {author && (
            <div className="bg-white border border-[#DDD6C8] p-6">
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

          <div className="bg-white border border-[#DDD6C8] p-6">
            <h4 className="font-serif font-semibold mb-3 pb-2 border-b border-[#DDD6C8]">
              Chuyên mục
            </h4>
            {categories.map((cat: any) =>
              cat.slug ? (
                <Link
                  key={cat.slug}
                  href={`/chuyen-muc/${cat.slug}`}
                  className="block py-2 text-sm border-b border-[#DDD6C8] last:border-none hover:text-[#2F6B62]"
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