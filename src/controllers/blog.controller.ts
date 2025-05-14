import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Request,
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
import { Types } from 'mongoose';
import {
  IBlogRepository,
  IBlogRepositoryToken,
} from 'src/abstract/repositories/blog.repository.interface';
import {
  ISavedBlogRepository,
  ISavedBlogRepositoryToken,
} from 'src/abstract/repositories/saved-blog.repository.interface';
import { BlogResponseDto, CreateBlogDto } from 'src/dtos/blog.dto';
import { CreateSavedBlogDto } from 'src/dtos/saved-blog.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Blog } from 'src/schemas/blog.schema';
import { SavedBlog } from 'src/schemas/saved-blog.schema';

@ApiTags('Blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogController {
  constructor(
    @Inject(IBlogRepositoryToken) private readonly blogRepo: IBlogRepository,
    @Inject(ISavedBlogRepositoryToken)
    private readonly savedBlogRepo: ISavedBlogRepository,
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

  @Delete(':blogId/save')
  @ApiOperation({ summary: 'Unsave a blog' })
  @ApiResponse({ status: 200, description: 'Blog unsaved' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'Saved blog not found' })
  async unsaveBlog(@Param('blogId') blogId: string, @Request() req) {
    const savedBlog: CreateSavedBlogDto = {
      user_id: req.user.user_id,
      blog_id: blogId,
    };
    const exists = await this.savedBlogRepo.findOne(savedBlog);

    if (!exists) {
      throw new BadRequestException('Saved blog does not exist');
    }

    await this.savedBlogRepo.deleteEntity(exists._id.toString());
    return { message: 'Blog unsaved' };
  }

  @Post(':blogId/save')
  @ApiOperation({ summary: 'Save a blog for the logged-in user' })
  @ApiResponse({ status: 201, description: 'Blog saved' })
  @ApiResponse({
    status: 400,
    description: 'Blog already saved',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async saveBlog(@Param('blogId') blogId: string, @Request() req) {
    const savedBlog: CreateSavedBlogDto = {
      user_id: req.user.user_id,
      blog_id: blogId,
    };
    const exists = await this.savedBlogRepo.findOne(savedBlog);

    if (exists) {
      throw new BadRequestException('Blog already saved');
    }

    const entity = this.mapper.map(savedBlog, CreateSavedBlogDto, SavedBlog);
    await this.savedBlogRepo.createEntity(entity);
  }

  @Get('me/saved-blogs')
  @ApiOperation({ summary: 'Get saved blogs of logged-in user' })
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
    description: 'List of saved blogs for the user',
    isArray: true,
    type: () => [BlogResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getSavedBlogs(
    @Query() query,
    @Request() req,
  ): Promise<BlogResponseDto[]> {
    const { page = 1, limit = 10 } = query;
    const userId = req.user.user_id;

    const savedBlogs = await this.savedBlogRepo.findAll(
      +page,
      +limit,
      { user_id: userId },
      ['blog_id'],
    );

    const blogDocs: Blog[] = savedBlogs.data.map(
      (savedBlog) => savedBlog.blog_id as Blog,
    );

    return this.mapper.mapArray(blogDocs, Blog, BlogResponseDto);
  }
}
