import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from 'src/schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Like.name,
        useFactory: () => {
          const schema = LikeSchema;
          schema.set('autoCreate', true);
          return schema;
        },
      },
    ]),
  ],
})
export class LikeModule {}
