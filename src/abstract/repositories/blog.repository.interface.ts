import { Blog } from 'src/schemas/blog.schema';
import { IBaseRepository } from './base.repositories.interface';

export interface IBlogRepository extends IBaseRepository<Blog> {}

export const IBlogRepositoryToken = Symbol('IBlogRepository');
