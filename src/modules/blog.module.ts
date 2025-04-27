import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Blog.name,
        useFactory: () => {
          const schema = BlogSchema;
          schema.set('autoCreate', true);
          return schema;
        },
      },
    ]),
  ],
})
export class BlogModule {}
