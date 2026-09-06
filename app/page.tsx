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

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Kinh tế tài chính</h1>
        <p className="text-gray-500 mt-1">Tài chính, kinh tế, không khó như bạn nghĩ</p>
      </header>

      <div className="space-y-10">
        {posts.map((post: any) => (
          <Link
            key={post.slug?.current}
            href={`/bai-viet/${post.slug?.current}`}
            className="flex gap-6 items-start hover:opacity-80 transition"
          >
            {post.coverImage && (
              <img
                src={urlFor(post.coverImage).width(240).height(160).url()}
                alt={post.title}
                className="w-48 h-32 object-cover rounded-md flex-shrink-0"
              />
            )}
            <div>
              <span className="text-xs uppercase tracking-wide text-blue-600 font-medium">
                {post.categoryTitle}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mt-1">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-1">bởi {post.authorName}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}