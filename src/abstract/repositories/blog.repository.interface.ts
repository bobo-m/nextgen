import { Blog } from 'src/schemas/blog.schema';
import { IBaseRepository } from './base.repository.interface';

export interface IBlogRepository extends IBaseRepository<Blog> {}

export const IBlogRepositoryToken = Symbol('IBlogRepository');
