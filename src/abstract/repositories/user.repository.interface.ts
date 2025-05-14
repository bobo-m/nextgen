import { User } from 'src/schemas/user.schema';
import { IBaseRepository } from './base.repositories.interface';

export interface IUserRepository extends IBaseRepository<User> {}

export const IUserRepositoryToken = Symbol('IUserRepository');
