import { SavedBlog } from 'src/schemas/saved-blog.schema';
import { IBaseRepository } from './base.repository.interface';

export interface ISavedBlogRepository extends IBaseRepository<SavedBlog> {}

export const ISavedBlogRepositoryToken = Symbol('ISavedBlogRepository');
