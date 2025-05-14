import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { SavedBlog } from 'src/schemas/saved-blog.schema';
import { ISavedBlogRepository } from 'src/abstract/repositories/saved-blog.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SavedBlogRepository
  extends BaseRepository<SavedBlog>
  implements ISavedBlogRepository
{
  constructor(
    @InjectModel(SavedBlog.name)
    private readonly savedBlogModel: Model<SavedBlog>,
  ) {
    super(savedBlogModel);
  }
}
