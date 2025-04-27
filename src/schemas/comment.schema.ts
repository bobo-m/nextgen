import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { SchemaTypes, Types } from 'mongoose';
import { User } from './user.schema';
import { Blog } from './blog.schema';

@Schema({ collection: 'comments', timestamps: { createdAt: 'created_at' } })
export class Comment extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Blog', required: true })
  blog: Types.ObjectId | Blog;

  @Prop({ type: String })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
