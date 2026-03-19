import { appSchema, tableSchema } from '@nozbe/watermelondb';

/**
 * schema — WatermelonDB database schema.
 *
 * Rules:
 * - snake_case for column names
 * - Always add `updated_at` (number) — used for LWW conflict resolution
 * - Always add `is_synced` (boolean) — tracks whether record is on server
 * - Increment `version` on every schema change (requires migration)
 */
export const schema = appSchema({
  version: 1,
  tables: [

    tableSchema({
      name: 'posts',
      columns: [
        { name: 'author_id',   type: 'string',  isIndexed: true },
        { name: 'title',       type: 'string' },
        { name: 'content',     type: 'string' },
        { name: 'is_draft',    type: 'boolean' },
        { name: 'created_at',  type: 'number' },
        { name: 'updated_at',  type: 'number' },
        { name: 'is_synced',   type: 'boolean' },
      ],
    }),

    tableSchema({
      name: 'comments',
      columns: [
        { name: 'post_id',    type: 'string', isIndexed: true },
        { name: 'author_id',  type: 'string', isIndexed: true },
        { name: 'body',       type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'is_synced',  type: 'boolean' },
      ],
    }),

    tableSchema({
      name: 'users',
      columns: [
        { name: 'email',        type: 'string' },
        { name: 'display_name', type: 'string' },
        { name: 'avatar_url',   type: 'string', isOptional: true },
        { name: 'updated_at',   type: 'number' },
        { name: 'is_synced',    type: 'boolean' },
      ],
    }),

  ],
});
