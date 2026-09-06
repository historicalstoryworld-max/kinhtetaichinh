import type {Metadata} from 'next'
import {Fraunces, Inter} from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'

const fraunces = Fraunces({subsets: ['latin', 'vietnamese'], variable: '--font-serif'})
const inter = Inter({subsets: ['latin', 'vietnamese'], variable: '--font-sans'})

export const metadata: Metadata = {
  title: 'Kinh tế tài chính',
  description: 'Tài chính, kinh tế, không khó như bạn nghĩ',
}

async function getCategories() {
  return client.fetch(`*[_type == "category"]{title, "slug": slug.current} | order(title asc)`)
}
async function getTickerPosts() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...8]{title, slug}`
  )
}

async function getAuthor() {
  return client.fetch(`*[_type == "author"][0]{name, bio}`)
}

async function getRecentPosts() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...3]{title, slug, coverImage, "authorName": author->name}`
  )
}

async function getGalleryImages() {
  return client.fetch(`*[_type == "post" && count(gallery) > 0][0...4]{gallery}`)
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()
  const tickerPosts = await getTickerPosts()
  const author = await getAuthor()
  const recentPosts = await getRecentPosts()
  const galleryDocs = await getGalleryImages()
  const galleryImages = galleryDocs.flatMap((d: any) => d.gallery || []).slice(0, 4)

  return (
    <html lang="vi">
      <body className={fraunces.variable + ' ' + inter.variable + ' font-sans bg-white text-[#1E2430]'}>
        <nav className="bg-[#EAF4FB] border-b border-[#D6E9F8]">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-8">
            <Link href="/" className="font-serif text-xl font-semibold text-[#0F3D66]">
              Kinh tế <span className="text-[#2F7FE0]">tài chính</span>
            </Link>
            <div className="flex gap-5">
              {categories.map((cat: any) =>
                cat.slug ? (
                  <Link
                    key={cat.slug}
                    href={`/chuyen-muc/${cat.slug}`}
                    className="text-sm text-[#0F3D66] opacity-80 hover:opacity-100"
                  >
                    {cat.title}
                  </Link>
                ) : null
              )}
            </div>
          </div>
        <div className="bg-[#2F7FE0] text-white overflow-hidden whitespace-nowrap py-2">
          <div className="inline-flex animate-marquee">
            {[...tickerPosts, ...tickerPosts].map((post: any, i: number) => (
              <Link
                key={i}
                href={`/bai-viet/${post.slug?.current}`}
                className="text-sm px-6 border-r border-white/30 hover:underline"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>
        </nav>

        {children}

        <footer className="bg-[#0F3D66] text-white mt-16">
          <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-serif font-semibold mb-4 pb-2 border-b border-white/20">
                Giới thiệu
              </h4>
              <p className="text-sm opacity-70">
                {author?.bio ||
                  'Kinh tế tài chính là nơi ghi lại những bài học về tiền bạc — viết đơn giản, cho người mới bắt đầu.'}
              </p>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4 pb-2 border-b border-white/20">
                Bài viết gần đây
              </h4>
              {recentPosts.map((post: any) => (
                <Link
                  key={post.slug?.current}
                  href={`/bai-viet/${post.slug?.current}`}
                  className="flex gap-3 py-3 border-b border-white/10 last:border-none"
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
                    <span className="text-xs opacity-60">{post.authorName}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4 pb-2 border-b border-white/20">
                Hình ảnh
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {galleryImages.map((img: any, i: number) => (
                  <img
                    key={i}
                    src={urlFor(img).width(160).height(160).url()}
                    alt=""
                    className="w-full h-20 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 py-6 border-t border-white/15 text-sm opacity-60">
            Kinh tế tài chính — Tài chính, kinh tế, bảo hiểm: không khó như bạn nghĩ
          </div>
        </footer>
      </body>
    </html>
  )
}