import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedBlog, SavedBlogSchema } from 'src/schemas/saved.blog.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: SavedBlog.name,
        useFactory: () => {
          const schema = SavedBlogSchema;
          schema.set('autoCreate', true);
          return schema;
        },
      },
    ]),
  ],
})
export class SavedBlogModule {}
