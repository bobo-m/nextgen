import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { AuthProfile } from 'src/mapping-profiles/auth.mapping-profile';
import { BlogProfile } from 'src/mapping-profiles/blog.mapping-profile';
import { UserProfile } from 'src/mapping-profiles/user.mapping-profile';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [BlogProfile, UserProfile, AuthProfile],
  exports: [BlogProfile, UserProfile, AuthProfile],
})
export class BaseAutomapperModule {}
