import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'CV Content',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'photoUrl',
      type: 'text',
      admin: {
        description: 'Paste any public image URL for the profile photo.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Professional headline shown below the name.',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: {
        description: 'Full LinkedIn profile URL.',
      },
    },
  ],
}
