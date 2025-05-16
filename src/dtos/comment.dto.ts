import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The ID of the blog to save',
    example: '6643f379a41bbcf66d225a78',
  })
  @IsMongoId()
  blog_id: string;

  @ApiProperty({
    description: 'The ID of the user saving the blog',
    example: '6643f1c7a41bbcf66d225a77',
  })
  @IsMongoId()
  user_id: string;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'Great article!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateCommentContentDto {
  @ApiProperty({
    description: 'The text content of the comment',
    example: 'Great article!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
