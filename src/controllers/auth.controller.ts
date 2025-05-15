import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/decorators/auth.decorator';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenDto,
} from 'src/dtos/login.dto';
import { SignupRequestDto } from 'src/dtos/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({
    description: 'User details for account creation',
    type: SignupRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: SignupRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already in use',
  })
  @Post('register')
  async register(@Body() signupRequestDto: SignupRequestDto) {
    return this.authService.register(signupRequestDto);
  }

  @Public()
  @ApiOperation({ summary: 'User login and JWT token generation' })
  @ApiResponse({ status: 200, description: 'User successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    // Validate User Credentials
    const user = await this.authService.validateUser(
      loginRequestDto.email,
      loginRequestDto.password,
    );

    return this.authService.login(user);
  }

  // Refresh Token: Get a new access token using refresh token
  @Public()
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @Post('refresh_token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  //Logout: Invalidates tokens.
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout and invalidate the user session' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.user_id);
  }
}
