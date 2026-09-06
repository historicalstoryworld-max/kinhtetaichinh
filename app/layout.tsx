import type {Metadata} from 'next'
import './globals.css'
import Link from 'next/link'
import {client} from '@/sanity/client'

export const metadata: Metadata = {
  title: 'Kinh tế tài chính',
  description: 'Tài chính, kinh tế, không khó như bạn nghĩ',
}

async function getCategories() {
  return client.fetch(`*[_type == "category"]{title, "slug": slug.current} | order(title asc)`)
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html lang="vi">
      <body>
        <nav className="border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-6">
            <Link href="/" className="font-semibold text-gray-900">
              Kinh tế tài chính
            </Link>
            <div className="flex gap-4">
              {categories.map((cat: any) =>
                cat.slug ? (
                  <Link
                    key={cat.slug}
                    href={`/chuyen-muc/${cat.slug}`}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {cat.title}
                  </Link>
                ) : null
              )}
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}