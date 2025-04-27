import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseSchema {
  _id: Types.ObjectId;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;
}
