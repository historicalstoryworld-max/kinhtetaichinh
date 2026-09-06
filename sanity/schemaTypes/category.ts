import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Chuyên mục',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Tên chuyên mục', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'Đường dẫn',
      type: 'slug',
      options: {source: 'title'},
    }),
  ],
})