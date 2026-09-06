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

async function getAuthor() {
  return client.fetch(`*[_type == "author"][0]{name, bio}`)
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
  const author = await getAuthor()
  const galleryDocs = await getGalleryImages()
  const galleryImages = galleryDocs.flatMap((d: any) => d.gallery || []).slice(0, 4)

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <html lang="vi">
      <body className={fraunces.variable + ' ' + inter.variable + ' font-sans bg-white text-[#1E2430]'}>
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <span className="text-xs text-gray-400">{today}</span>
        </div>

        <div className="text-center pt-4 pb-6">
          <Link href="/">
            <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#0F3D66]">
              Kinh tế tài chính
            </h1>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Kinh tế - Tài chính - Bảo hiểm: Không khó như bạn nghĩ
          </p>
        </div>

        <div className="bg-[#0F3D66] text-white">
          <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-5 overflow-x-auto">
                        <span className="flex-shrink-0 text-xs font-semibold bg-[#E2483B] px-3 py-1 rounded">
              TOP TOPICS
            </span>
            {categories.map((cat: any) =>
              cat.slug ? (
                <Link
                  key={cat.slug}
                  href={`/chuyen-muc/${cat.slug}`}
                  className="flex-shrink-0 text-sm opacity-85 hover:opacity-100 whitespace-nowrap"
                >
                  {cat.title}
                </Link>
              ) : null
            )}
          </div>
        </div>

        {children}

        <footer className="bg-[#0F3D66] text-white mt-16">
          <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
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