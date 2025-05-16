import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { SchemaTypes, Types } from 'mongoose';
import { User } from './user.schema';
import { Blog } from './blog.schema';

@Schema({ collection: 'comments', timestamps: { createdAt: 'created_at' } })
export class Comment extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId | User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Blog', required: true })
  blog_id: Types.ObjectId | Blog;

  @Prop({ type: String, required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
