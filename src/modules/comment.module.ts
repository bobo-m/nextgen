import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Comment.name,
        useFactory: () => {
          const schema = CommentSchema;
          schema.set('autoCreate', true);
          return schema;
        },
      },
    ]),
  ],
})
export class CommentModule {}
