import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedBlog, SavedBlogSchema } from 'src/schemas/saved.blog.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SavedBlog.name,
        schema: SavedBlogSchema,
      },
    ]),
  ],
})
export class SavedBlogModule {}
