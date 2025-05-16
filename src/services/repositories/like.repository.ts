import { Like } from 'src/schemas/like.schema';
import { BaseRepository } from './base.repository';
import { ILikeRepository } from 'src/abstract/repositories/like.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class LikeRepository
  extends BaseRepository<Like>
  implements ILikeRepository
{
  constructor(@InjectModel(Like.name) private readonly likeModel: Model<Like>) {
    super(likeModel);
  }
}
