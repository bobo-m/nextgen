import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IBlogRepositoryToken } from 'src/abstract/repositories/blog.repository.interface';
import { ILikeRepositoryToken } from 'src/abstract/repositories/like.repository.interface';
import { LikeController } from 'src/controllers/like.controller';
import { Like, LikeSchema } from 'src/schemas/like.schema';
import { BlogRepository } from 'src/services/repositories/blog.repository';
import { LikeRepository } from 'src/services/repositories/like.repository';
import { BlogModule } from './blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema,
      },
    ]),
    BlogModule,
  ],
  controllers: [LikeController],
  providers: [{ provide: ILikeRepositoryToken, useClass: LikeRepository }],
})
export class LikeModule {}
