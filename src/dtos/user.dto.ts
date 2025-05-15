import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserRequestDto {
  @ApiProperty({
    title: 'Full Name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    title: 'Email Address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    title: 'Password',
    example: 'securePassword123',
  })
  password: string;

  @ApiProperty({
    title: 'Profile Picture URL',
    example: 'https://example.com/avatar.png',
    required: false,
    nullable: true,
  })
  profile_picture?: string | null;

  @ApiProperty({
    title: 'User Role',
    enum: ['student', 'admin'],
    example: 'student',
  })
  @IsEnum(['student', 'admin'])
  role: 'student' | 'admin';
}

export class UserResponseDto {
  @ApiProperty({
    title: 'User ID',
    example: '60f7f889ec8f8a001c7e4c2b',
  })
  id: string;

  @ApiProperty({
    title: 'Full Name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    title: 'Email Address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    title: 'Profile Picture URL',
    example: 'https://example.com/avatar.png',
    required: false,
    nullable: true,
  })
  profile_picture?: string | null;

  @ApiProperty({
    title: 'User Role',
    enum: ['student', 'admin'],
    example: 'student',
  })
  role: 'student' | 'admin';

  @ApiProperty({
    title: 'Active Status',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    title: 'Created At',
    example: '2023-10-13T10:23:45.000Z',
  })
  created_at: Date;

  @ApiProperty({
    title: 'Updated At',
    example: '2023-12-01T12:00:00.000Z',
  })
  updated_at: Date;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ title: 'Updated user name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ title: 'Updated email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ title: 'Updated profile picture URL' })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiPropertyOptional({
    title: 'Updated user role',
    enum: ['student', 'admin'],
  })
  @IsOptional()
  @IsEnum(['student', 'admin'])
  role?: 'student' | 'admin';
}

export class UpdateSkillsDto {
  @ApiProperty({
    description: 'Array of technical skills',
    example: ['React', 'NestJS', 'TypeScript'],
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
