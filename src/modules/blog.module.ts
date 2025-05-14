import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IBlogRepositoryToken } from 'src/abstract/repositories/blog.repository.interface';
import { BlogController } from 'src/controllers/blog.controller';
import { Blog, BlogSchema } from 'src/schemas/blog.schema';
import { BlogRepository } from 'src/services/repositories/blog.repository';
import { SavedBlogModule } from './saved-blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
    SavedBlogModule,
  ],
  providers: [
    {
      provide: IBlogRepositoryToken,
      useClass: BlogRepository,
    },
  ],
  controllers: [BlogController],
})
export class BlogModule {}
