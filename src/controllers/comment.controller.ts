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
  Request,
  UnauthorizedException,
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
  ICommentRepository,
  ICommentRepositoryToken,
} from 'src/abstract/repositories/comment.repository.interface';
import {
  CreateCommentContentDto,
  CreateCommentDto,
} from 'src/dtos/comment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Comment } from 'src/schemas/comment.schema';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentController {
  constructor(
    @Inject(ICommentRepositoryToken)
    private readonly commentRepo: ICommentRepository,
    @Inject(IBlogRepositoryToken) private readonly blogRepo: IBlogRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @ApiOperation({ summary: 'Add a comment to a blog' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiParam({ name: 'blogId', type: String, description: 'Blog Id' })
  @Post('blogs/:blogId/comments')
  async addComment(
    @Param('blogId') blogId: string,
    @Request() req,
    @Body() createCommentContentDto: CreateCommentContentDto,
  ) {
    const userId = req.user.user_id;
    const createCommentDto: CreateCommentDto = {
      user_id: userId,
      blog_id: blogId,
      content: createCommentContentDto.content,
    };

    const exists = await this.commentRepo.findOne(createCommentDto);

    if (exists) {
      throw new BadRequestException('Comment already exists');
    }

    const entity = this.mapper.map(createCommentDto, CreateCommentDto, Comment);
    await this.commentRepo.createEntity(entity);

    return { message: 'Comment added' };
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized to delete this comment',
  })
  @ApiParam({ name: 'blogId', type: String })
  @ApiParam({ name: 'commentId', type: String })
  @Delete('blogs/:blogId/comments/:commentId')
  async deleteComment(@Param('commentId') commentId: string, @Request() req) {
    const userId = req.user.user_id;
    const comment = await this.commentRepo.findOne({ _id: commentId });

    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    if (comment.user_id.toString() !== userId) {
      throw new UnauthorizedException('Unauthorized to delete this comment');
    }

    await this.commentRepo.deleteEntity(commentId);
    return { message: 'Comment deleted' };
  }

  @ApiOperation({ summary: 'Get all blogs user commented on' })
  @ApiResponse({ status: 200, description: 'List of blogs commented by user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('users/me/commented-blogs')
  async getCommentedBlogs(@Request() req) {
    const userId = req.user.user_id;

    const comments = await this.commentRepo.findAll(
      undefined,
      undefined,
      {
        user: userId,
      },
      ['blog_id'],
    );

    const blogs = comments.data.map((comment) => comment.blog_id);
    return blogs;
  }
}
