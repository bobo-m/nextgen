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
import { CreateCommentDto } from 'src/dtos/comment.dto';
import { Comment } from 'src/schemas/comment.schema';

@Injectable()
export class CommentProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCommentDto,
        Comment,
        forMember(
          (d) => d.blog_id,
          mapFrom((s) => new Types.ObjectId(s.blog_id)),
        ),
        forMember(
          (d) => d.user_id,
          mapFrom((s) => new Types.ObjectId(s.user_id)),
        ),
        forMember(
          (d) => d.content,
          mapFrom((s) => s.content),
        ),
      );
    };
  }
}
