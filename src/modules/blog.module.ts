import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IBlogRepositoryToken } from 'src/abstract/repositories/blog.repository.interface';
import { BlogController } from 'src/controllers/blog.controller';
import { Blog, BlogSchema } from 'src/schemas/blog.schema';
import { BlogRepository } from 'src/services/repositories/blog.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: IBlogRepositoryToken,
      useClass: BlogRepository,
    },
  ],
  controllers: [BlogController],
  exports: [IBlogRepositoryToken],
})
export class BlogModule {}
