import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Indigo', value: 'indigo'},
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
          {title: 'Red', value: 'red'},
          {title: 'Orange', value: 'orange'},
          {title: 'Purple', value: 'purple'},
          {title: 'Pink', value: 'pink'},
        ],
        layout: 'radio',
      },
      initialValue: 'indigo',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'description'},
  },
})
