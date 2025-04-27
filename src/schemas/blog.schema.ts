import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { SchemaTypes, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({
  collection: 'blogs',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Blog extends BaseSchema {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId | User;

  @Prop({ type: [String], required: true })
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
