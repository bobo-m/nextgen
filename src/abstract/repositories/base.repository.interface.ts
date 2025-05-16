import { FilterQuery, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;

  createEntity(createObj: T): Promise<T>;

  updateEntity(id: string, updateObj: UpdateQuery<T>): Promise<T | null>;

  deleteEntity(id: string): Promise<Boolean>;

  findOne(options: FilterQuery<T>): Promise<T | null>;

  findAll(
    page?: number,
    limit?: number,
    filter?: FilterQuery<T>,
    populateFields?: string[],
  ): Promise<{
    data: T[];
    total: number;
    page?: number;
    lastPage?: number;
  }>;
}
