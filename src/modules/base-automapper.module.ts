import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { AuthProfile } from 'src/mapping-profiles/auth.mapping-profile';
import { BlogProfile } from 'src/mapping-profiles/blog.mapping-profile';
import { CommentProfile } from 'src/mapping-profiles/comment.mapping-profile';
import { LikeProfile } from 'src/mapping-profiles/like.mapping-profile';
import { SavedBlogProfile } from 'src/mapping-profiles/saved-blog.mapping-profile';
import { UserProfile } from 'src/mapping-profiles/user.mapping-profile';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    BlogProfile,
    UserProfile,
    AuthProfile,
    SavedBlogProfile,
    LikeProfile,
    CommentProfile,
  ],
  exports: [
    BlogProfile,
    UserProfile,
    AuthProfile,
    SavedBlogProfile,
    LikeProfile,
    CommentProfile,
  ],
})
export class BaseAutomapperModule {}
