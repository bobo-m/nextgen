import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ISavedBlogRepositoryToken } from 'src/abstract/repositories/saved-blog.repository.interface';
import { SavedBlog, SavedBlogSchema } from 'src/schemas/saved-blog.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { SavedBlogRepository } from 'src/services/repositories/saved-blog.repository';
import { BlogModule } from './blog.module';
import { SavedBlogController } from 'src/controllers/saved-blog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SavedBlog.name,
        schema: SavedBlogSchema,
      },
    ]),
    BlogModule,
  ],
  controllers: [SavedBlogController],
  providers: [
    { provide: ISavedBlogRepositoryToken, useClass: SavedBlogRepository },
  ],
  exports: [ISavedBlogRepositoryToken],
})
export class SavedBlogModule {}
