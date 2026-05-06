import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    group: 'CV Content',
    defaultColumns: ['title', 'category', 'date'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Start date or year of the entry — used for sorting.',
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Organisation, institution or context (e.g. "Digital Dept, UiTM Shah Alam")',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Leave blank if current / ongoing.',
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'isPresent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if this is a current role/ongoing.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Main description paragraph.',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      admin: {
        description: 'Bullet-point achievements or details.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      admin: {
        description: 'Technologies used (mainly for project entries).',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Manual sort weight within a category (lower = higher on page).',
      },
    },
  ],
}
