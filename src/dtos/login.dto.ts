import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'User email address', example: 'user@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password' })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh Token', example: 'refresh_token' })
  @IsString()
  refresh_token: string;
}
