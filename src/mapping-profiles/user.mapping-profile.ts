import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/dtos/user.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // --- Entity -> Response DTO ---
      createMap(
        mapper,
        User,
        UserResponseDto,
        forMember(
          (d) => d.id,
          mapFrom((s) => s._id.toString()),
        ),
        forMember(
          (d) => d.name,
          mapFrom((s) => s.name),
        ),
        forMember(
          (d) => d.email,
          mapFrom((s) => s.email),
        ),
        forMember(
          (d) => d.is_active,
          mapFrom((s) => s.is_active),
        ),
        forMember(
          (d) => d.role,
          mapFrom((s) => s.role),
        ),
        forMember(
          (d) => d.profile_picture,
          mapFrom((s) => s.profile_picture),
        ),
        forMember(
          (d) => d.created_at,
          mapFrom((s) => s.created_at),
        ),
        forMember(
          (d) => d.updated_at,
          mapFrom((s) => s.updated_at),
        ),
      );
    };
  }
}
