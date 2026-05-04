import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

const databaseUrl = process.env.DATABASE_URL || 'file:./payload.db'
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
    {
      slug: 'posts',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  db: sqliteAdapter({
    client: {
      authToken: databaseAuthToken,
      url: databaseUrl,
    },
  }),
  editor: lexicalEditor(),
  plugins: [payloadCloudPlugin()],
  secret: process.env.PAYLOAD_SECRET || 'payload-sqlite-opennext-drizzle-kit-repro-secret',
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
})
