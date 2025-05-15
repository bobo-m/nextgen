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

export class SignupRequestDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Jane Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'securePass123',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    title: 'User Role',
    enum: ['student', 'admin'],
    example: 'student',
  })
  @IsEnum(['student', 'admin'])
  role: 'student' | 'admin';

  @ApiPropertyOptional({
    description: 'Array of technical skills',
    example: ['React', 'NestJS', 'TypeScript'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
