import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from 'src/schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema,
      },
    ]),
  ],
})
export class LikeModule {}
