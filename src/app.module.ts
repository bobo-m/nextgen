import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { BlogModule } from './modules/blog.module';
import { CommentModule } from './modules/comment.module';
import { LikeModule } from './modules/like.module';
import { SavedBlogModule } from './modules/saved.blog.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    UserModule,
    BlogModule,
    CommentModule,
    LikeModule,
    SavedBlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
