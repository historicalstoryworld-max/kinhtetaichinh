import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'
import {PortableText} from '@portabletext/react'

async function getPost(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      coverImage,
      body,
      videoUrl,
      slideFile,
      gallery,
      "categoryTitle": category->title,
      "authorName": author->name
    }`,
    {slug}
  )
}

export default async function PostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const post = await getPost(slug)

  if (!post) {
    return <main className="max-w-3xl mx-auto px-6 py-16">Không tìm thấy bài viết.</main>
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <span className="text-xs uppercase tracking-wide text-blue-600 font-medium">
        {post.categoryTitle}
      </span>
      <h1 className="text-3xl font-semibold text-gray-900 mt-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mt-2 mb-8">bởi {post.authorName}</p>

      {post.coverImage && (
        <img
          src={urlFor(post.coverImage).width(800).height(450).url()}
          alt={post.title}
          className="w-full rounded-md mb-8"
        />
      )}

      {post.videoUrl && (
        <div className="mb-8 aspect-video">
          <iframe
            className="w-full h-full rounded-md"
            src={post.videoUrl.replace('watch?v=', 'embed/')}
            allowFullScreen
          />
        </div>
      )}

      <div className="prose prose-gray max-w-none mb-8">
        <PortableText value={post.body} />
      </div>

           {post.slideFile?.asset && (
        <a href={'https://cdn.sanity.io/files/l2dw01h9/production/' + post.slideFile.asset._ref.replace('file-', '').replace('-pdf', '.pdf')} target="_blank" className="inline-block mb-8 text-blue-600 underline">
          Xem slide đính kèm
        </a>
      )}

      {post.gallery && post.gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {post.gallery.map((img: any, i: number) => (
            <img
              key={i}
              src={urlFor(img).width(300).height(300).url()}
              alt=""
              className="w-full h-40 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </main>
  )
}