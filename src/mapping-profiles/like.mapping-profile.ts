import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateLikeDto } from 'src/dtos/like.dto';
import { Like } from 'src/schemas/like.schema';

@Injectable()
export class LikeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // --- DTO -> Entity ---
      createMap(
        mapper,
        CreateLikeDto,
        Like,
        forMember(
          (d) => d.blog_id,
          mapFrom((s) => new Types.ObjectId(s.blog_id)),
        ),
        forMember(
          (d) => d.user_id,
          mapFrom((s) => new Types.ObjectId(s.user_id)),
        ),
      );
    };
  }
}
