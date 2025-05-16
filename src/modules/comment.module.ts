import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ICommentRepositoryToken } from 'src/abstract/repositories/comment.repository.interface';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { CommentRepository } from 'src/services/repositories/comment.repository';
import { BlogModule } from './blog.module';
import { CommentController } from 'src/controllers/comment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    BlogModule,
  ],
  controllers: [CommentController],
  providers: [
    { provide: ICommentRepositoryToken, useClass: CommentRepository },
  ],
})
export class CommentModule {}
