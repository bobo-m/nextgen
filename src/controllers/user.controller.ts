import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/abstract/repositories/user.repository.interface';
import {
  UpdateSkillsDto,
  UpdateUserDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get logged-in user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the currently authenticated user',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getProfile(@Request() req) {
    const user = await this.userRepository.findById(
      req.user.user_id.toString(),
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapper.map(user, User, UserResponseDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update logged-in user profile' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async updateProfile(
    @Request() req,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(req.user.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.updateEntity(
      req.user.user_id,
      updateUser,
    );

    return this.mapper.map(updatedUser, User, UserResponseDto);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get logged-in user technical skills' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of user skills',
    schema: {
      example: {
        skills: ['React', 'Node.js', 'MongoDB', 'Figma'],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getSkills(@Request() req) {
    const user = await this.userRepository.findById(req.user.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { skills: user.skills ?? [] };
  }

  @Patch('skills')
  @ApiOperation({ summary: 'Update logged-in user technical skills' })
  @ApiResponse({
    status: 200,
    description: 'Updated user skills',
    schema: {
      example: {
        skills: ['React', 'NestJS', 'TypeScript'],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async updateSkills(@Request() req, @Body() updateSkillsDto: UpdateSkillsDto) {
    const user = await this.userRepository.findById(req.user.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.updateEntity(
      req.user.user_id,
      { skills: updateSkillsDto.skills },
    );

    return { skills: updatedUser?.skills ?? [] };
  }
}
