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
import { CreateSavedBlogDto } from 'src/dtos/saved-blog.dto';
import { SavedBlog } from 'src/schemas/saved-blog.schema';

@Injectable()
export class SavedBlogProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // --- DTO -> Entity ---
      createMap(
        mapper,
        CreateSavedBlogDto,
        SavedBlog,
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
