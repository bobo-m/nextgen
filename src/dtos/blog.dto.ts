import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog post',
    example: 'How to Learn NestJS in 30 Days',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the blog post',
    example:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'MongoDB ObjectId of the author',
    example: '66397c0ec6e961e6dd2c6d3c',
  })
  @IsMongoId()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'Tags related to the blog post',
    example: ['nestjs', 'nodejs', 'backend'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class BlogResponseDto extends CreateBlogDto {
  id: string;
  created_at: Date;
  updated_at: Date;
}
