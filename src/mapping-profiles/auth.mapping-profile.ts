import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { SignupRequestDto } from 'src/dtos/auth.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // --- Create DTO -> Entity ---
      createMap(
        mapper,
        SignupRequestDto,
        User,
        forMember(
          (d) => d.email,
          mapFrom((s) => s.email),
        ),
        forMember(
          (d) => d.name,
          mapFrom((s) => s.name),
        ),
        forMember(
          (d) => d.password,
          mapFrom((s) => s.password),
        ),
        forMember(
          (d) => d.role,
          mapFrom((s) => s.role),
        ),
        forMember(
          (d) => d.skills,
          mapFrom((s) => s.skills),
        ),
      );
    };
  }
}
