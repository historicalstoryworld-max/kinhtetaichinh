import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Bài viết',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Tiêu đề', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'Đường dẫn',
      type: 'slug',
      options: {source: 'title'},
    }),
    defineField({
      name: 'category',
      title: 'Chuyên mục',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'author',
      title: 'Tác giả',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'coverImage',
      title: 'Ảnh đại diện',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'videoUrl', title: 'Video (link YouTube)', type: 'url'}),
    defineField({name: 'slideFile', title: 'Slide đính kèm (PDF)', type: 'file'}),
    defineField({
      name: 'gallery',
      title: 'Thư mục ảnh',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'body',
      title: 'Nội dung',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
    }),
    defineField({name: 'publishedAt', title: 'Ngày đăng', type: 'datetime'}),
  ],
})