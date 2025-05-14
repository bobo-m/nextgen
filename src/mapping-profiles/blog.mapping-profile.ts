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
import { BlogResponseDto, CreateBlogDto } from 'src/dtos/blog.dto';
import { Blog } from 'src/schemas/blog.schema';

@Injectable()
export class BlogProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // --- Entity -> Response DTO ---
      createMap(
        mapper,
        Blog,
        BlogResponseDto,
        forMember(
          (d) => d.id,
          mapFrom((s) => s._id.toString()),
        ),
        forMember(
          (d) => d.title,
          mapFrom((s) => s.title),
        ),
        forMember(
          (d) => d.content,
          mapFrom((s) => s.content),
        ),
        forMember(
          (d) => d.author,
          mapFrom((s) => s.author?.toString?.() ?? s.author),
        ),
        forMember(
          (d) => d.tags,
          mapFrom((s) => s.tags),
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

      // --- Create DTO -> Entity ---
      createMap(
        mapper,
        CreateBlogDto,
        Blog,
        forMember(
          (d) => d.title,
          mapFrom((s) => s.title),
        ),
        forMember(
          (d) => d.content,
          mapFrom((s) => s.content),
        ),
        forMember(
          (d) => d.author,
          mapFrom((s) => new Types.ObjectId(s.author)),
        ),
        forMember(
          (d) => d.tags,
          mapFrom((s) => s.tags),
        ),
      );
    };
  }
}
