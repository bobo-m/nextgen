import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  IBlogRepository,
  IBlogRepositoryToken,
} from 'src/abstract/repositories/blog.repository.interface';
import {
  ILikeRepository,
  ILikeRepositoryToken,
} from 'src/abstract/repositories/like.repository.interface';
import { BlogResponseDto } from 'src/dtos/blog.dto';
import { CreateLikeDto } from 'src/dtos/like.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Blog } from 'src/schemas/blog.schema';
import { Like } from 'src/schemas/like.schema';

@ApiTags('Likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class LikeController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(ILikeRepositoryToken) private readonly likeRepo: ILikeRepository,
    @Inject(IBlogRepositoryToken) private readonly blogRepo: IBlogRepository,
  ) {}

  @Post('blogs/:blogId/like')
  @ApiOperation({ summary: 'Like a blog' })
  @ApiResponse({ status: 201, description: 'Blog liked' })
  @ApiResponse({ status: 400, description: 'Blog already liked' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiParam({ name: 'blogId', type: String, description: 'Blog Id' })
  async likeBlog(@Param('blogId') blogId: string, @Request() req) {
    const userId = req.user.user_id;
    const createLikeDto: CreateLikeDto = {
      user_id: userId,
      blog_id: blogId,
    };
    const exists = await this.likeRepo.findOne(createLikeDto);

    if (exists) {
      throw new BadRequestException('Blog already liked');
    }

    const entity = this.mapper.map(createLikeDto, CreateLikeDto, Like);

    await this.likeRepo.createEntity(entity);
    return { message: 'Blog liked' };
  }

  @Delete('blogs/:blogId/like')
  @ApiOperation({ summary: 'Unlike a blog' })
  @ApiResponse({ status: 200, description: 'Blog unliked' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  @ApiParam({ name: 'blogId', type: String, description: 'Blog Id' })
  async unlikeBlog(@Param('blogId') blogId: string, @Request() req) {
    const userId = req.user.user_id;
    const like = await this.likeRepo.findOne({
      user_id: userId,
      blog_id: blogId,
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepo.deleteEntity(like._id.toString());
    return { message: 'Blog unliked' };
  }

  @Get('users/me/liked-blogs')
  @ApiOperation({ summary: 'Get all blogs liked by user' })
  @ApiResponse({ status: 200, description: 'List of liked blogs returned' })
  async getLikedBlogs(@Request() req): Promise<BlogResponseDto[]> {
    const userId = req.user.user_id;
    const liked = await this.likeRepo.findAll(1, 100, { user_id: userId }, [
      'blog_id',
    ]);
    return liked.data.map((like) =>
      this.mapper.map(like.blog_id, Blog, BlogResponseDto),
    );
  }
}
