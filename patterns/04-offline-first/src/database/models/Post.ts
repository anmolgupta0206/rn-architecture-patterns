import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, action } from '@nozbe/watermelondb/decorators';

/**
 * Post — WatermelonDB model
 *
 * WatermelonDB decorator import change:
 * - All decorators (field, date, readonly, action, relation, children, lazy)
 *   now import from '@nozbe/watermelondb/decorators' (single path)
 * - Previously some were available directly from '@nozbe/watermelondb'
 *
 * TypeScript note: decorators require "experimentalDecorators": true in tsconfig
 * and "useDefineForClassFields": false if targeting ES2022+
 */
export class Post extends Model {
  static table = 'posts';

  @field('author_id')   authorId!: string;
  @field('title')       title!: string;
  @field('content')     content!: string;
  @field('is_draft')    isDraft!: boolean;
  @field('is_synced')   isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at')           updatedAt!: Date;

  @action async markAsSynced() {
    await this.update((post) => {
      post.isSynced = true;
    });
  }

  @action async updateContent(title: string, content: string) {
    await this.update((post) => {
      post.title    = title;
      post.content  = content;
      post.isSynced = false;
    });
  }

  @action async publish() {
    await this.update((post) => {
      post.isDraft  = false;
      post.isSynced = false;
    });
  }
}
