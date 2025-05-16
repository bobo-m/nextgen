import { Comment } from 'src/schemas/comment.schema';
import { IBaseRepository } from './base.repository.interface';

export interface ICommentRepository extends IBaseRepository<Comment> {}

export const ICommentRepositoryToken = Symbol('ICommentRepository');
