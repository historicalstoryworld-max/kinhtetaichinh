import {defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Tác giả',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Tên', type: 'string'}),
    defineField({name: 'bio', title: 'Giới thiệu', type: 'text'}),
    defineField({name: 'avatar', title: 'Ảnh đại diện', type: 'image'}),
  ],
})