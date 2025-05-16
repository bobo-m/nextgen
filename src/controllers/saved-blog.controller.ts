import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
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
import { BlogResponseDto } from 'src/dtos/blog.dto';
import { CreateSavedBlogDto } from 'src/dtos/saved-blog.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Blog } from 'src/schemas/blog.schema';
import { SavedBlog } from 'src/schemas/saved-blog.schema';

@ApiTags('Saved Blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SavedBlogController {
  constructor(
    @Inject(IBlogRepositoryToken) private readonly blogRepo: IBlogRepository,
    @Inject(ISavedBlogRepositoryToken)
    private readonly savedBlogRepo: ISavedBlogRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

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
    return await this.savedBlogRepo.createEntity(entity);
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
