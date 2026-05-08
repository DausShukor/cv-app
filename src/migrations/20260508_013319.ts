import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "profile"
      DROP COLUMN IF EXISTS "photo_id",
      ADD COLUMN IF NOT EXISTS "photo_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "profile"
      DROP COLUMN IF EXISTS "photo_url",
      ADD COLUMN IF NOT EXISTS "photo_id" integer;
  `)
}
