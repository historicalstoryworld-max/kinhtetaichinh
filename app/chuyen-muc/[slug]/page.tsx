import Link from 'next/link'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'

async function getCategoryPosts(slug: string) {
  return client.fetch(
    `*[_type == "post" && category->slug.current == $slug] | order(publishedAt desc){
      title,
      slug,
      coverImage,
      "categoryTitle": category->title,
      "authorName": author->name
    }`,
    {slug}
  )
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const posts = await getCategoryPosts(slug)

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        {posts[0]?.categoryTitle || 'Chuyên mục'}
      </h1>
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
              <h2 className="text-xl font-semibold text-gray-900 mt-1">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-1">bởi {post.authorName}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}