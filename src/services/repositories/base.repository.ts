import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { IBaseRepository } from 'src/abstract/repositories/base.repositories.interface';

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  async findById(id: string): Promise<T | null> {
    if (!this.isValidObjectId(id)) return null;

    return this.model
      .findById(id)
      .where({ is_active: true })
      .where({
        $or: [
          { deleted_at: { $eq: null } },
          { deleted_at: { $exists: false } },
        ],
      })
      .exec();
  }

  async createEntity(createObj: T): Promise<T> {
    const newEntity = await this.model.create(createObj);
    return newEntity.toObject();
  }

  async updateEntity(id: string, updateObj: UpdateQuery<T>): Promise<T | null> {
    if (!this.isValidObjectId(id)) return null;

    return this.model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          is_active: true,
          $or: [
            { deleted_at: { $eq: null } },
            { deleted_at: { $exists: false } },
          ],
        },
        updateObj,
        { new: true },
      )
      .exec();
  }

  async deleteEntity(id: string): Promise<Boolean> {
    if (!this.isValidObjectId(id)) return false;

    const result = await this.model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          is_active: true,
          $or: [
            { deleted_at: { $eq: null } },
            { deleted_at: { $exists: false } },
          ],
        },
        { deleted_at: new Date() },
      )
      .exec();

    return !!result;
  }

  async findOne(options: FilterQuery<T>): Promise<T | null> {
    return this.model
      .findOne({
        ...options,
        is_active: true,
        $or: [
          { deleted_at: { $eq: null } },
          { deleted_at: { $exists: false } },
        ],
      })
      .exec();
  }

  async findAll(
    page: number = 1,
    limit: number = 1000,
    filter?: FilterQuery<T> | undefined,
    populateFields?: string[],
  ): Promise<{ data: T[]; total: number; page?: number; lastPage?: number }> {
    const baseFilter: FilterQuery<T> = {
      is_active: true,
      $or: [{ deleted_at: { $eq: null } }, { deleted_at: { $exists: false } }],
      ...filter,
    };

    let query = this.model.find(baseFilter);

    if (Array.isArray(populateFields)) {
      for (const field of populateFields) {
        query = query.populate(field);
      }
    }

    const total = await this.model.countDocuments(baseFilter);
    const lastPage = Math.ceil(total / limit);

    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total, page, lastPage };
  }
}
