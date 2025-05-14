import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateSavedBlogDto {
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
}

export class SavedBlogResponseDto {
  @ApiProperty({
    description: 'Unique ID of the saved blog entry',
    example: '6650d5c57c5a3a84b321e849',
  })
  @IsMongoId()
  id: string;

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
}
