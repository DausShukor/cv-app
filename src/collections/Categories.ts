import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'CV Content',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier, e.g. work-experience',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Controls section display order on the CV page (lower = higher on page)',
      },
    },
  ],
}
