import type { CollectionConfig } from 'payload'

export const FrontendUsers: CollectionConfig = {
  slug: 'frontend-users',
  admin: {
    useAsTitle: 'email',
    group: 'Frontend',
    description: 'Users who can log in and view the CV on the frontend.',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return { id: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      return { id: { equals: user.id } }
    },
    delete: () => false,
  },
}
