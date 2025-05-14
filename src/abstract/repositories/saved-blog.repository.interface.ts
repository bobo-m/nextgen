import { SavedBlog } from 'src/schemas/saved-blog.schema';
import { IBaseRepository } from './base.repositories.interface';

export interface ISavedBlogRepository extends IBaseRepository<SavedBlog> {}

export const ISavedBlogRepositoryToken = Symbol('ISavedBlogInterface');
