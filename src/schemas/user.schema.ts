import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { HydratedDocument } from 'mongoose';

/*
 * User schema for MongoDB collection 'users'
 */
@Schema({
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: null })
  profile_picture?: string | null;

  @Prop({ type: String, enum: ['student', 'admin'], default: 'student' })
  role: 'student' | 'admin';

  @Prop({ type: String, default: '' })
  refresh_token: string;

  @Prop({ type: [String], default: [] })
  skills: string[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
