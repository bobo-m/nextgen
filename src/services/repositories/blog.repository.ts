import { Blog } from 'src/schemas/blog.schema';
import { BaseRepository } from './base.repository';
import { IBlogRepository } from 'src/abstract/repositories/blog.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class BlogRepository
  extends BaseRepository<Blog>
  implements IBlogRepository
{
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {
    super(blogModel);
  }
}
