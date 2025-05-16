import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  IBlogRepository,
  IBlogRepositoryToken,
} from 'src/abstract/repositories/blog.repository.interface';
import {
  ISavedBlogRepository,
  ISavedBlogRepositoryToken,
} from 'src/abstract/repositories/saved-blog.repository.interface';
import { BlogResponseDto, CreateBlogDto } from 'src/dtos/blog.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Blog } from 'src/schemas/blog.schema';

@ApiTags('Blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogController {
  constructor(
    @Inject(IBlogRepositoryToken) private readonly blogRepo: IBlogRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of blogs retrieved successfully',
    type: [BlogResponseDto],
  })
  @Get()
  async listBlogs(@Query() query: any) {
    const { page = 1, limit = 10, ...filters } = query;
    const result = await this.blogRepo.findAll(+page, +limit, filters);

    return result;
  }

  @ApiBody({ type: CreateBlogDto })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully',
    type: BlogResponseDto,
  })
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const entity = this.mapper.map(createBlogDto, CreateBlogDto, Blog);
    const newBlog = await this.blogRepo.createEntity(entity);

    return this.mapper.map(newBlog, Blog, BlogResponseDto);
  }
}
