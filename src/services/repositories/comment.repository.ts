import { ICommentRepository } from 'src/abstract/repositories/comment.repository.interface';
import { BaseRepository } from './base.repository';
import { Comment } from 'src/schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CommentRepository
  extends BaseRepository<Comment>
  implements ICommentRepository
{
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }
}
