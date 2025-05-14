import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IUserRepositoryToken } from 'src/abstract/repositories/user.repository.interface';
import { UserController } from 'src/controllers/user.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserRepository } from 'src/services/repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [IUserRepositoryToken],
})
export class UserModule {}
