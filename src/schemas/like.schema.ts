import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';
import { User } from './user.schema';
import { Blog } from './blog.schema';

@Schema({
  collection: 'likes',
  timestamps: { createdAt: 'created_at' },
})
export class Like extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId | User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Blog', required: true })
  blog_id: Types.ObjectId | Blog;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
