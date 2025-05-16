import { Like } from 'src/schemas/like.schema';
import { IBaseRepository } from './base.repository.interface';

export interface ILikeRepository extends IBaseRepository<Like> {}

export const ILikeRepositoryToken = Symbol('ILikeRepository');
