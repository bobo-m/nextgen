import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/abstract/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from 'src/dtos/login.dto';
import { SignupRequestDto } from 'src/dtos/auth.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class AuthService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (user && user.password) {
      return user;
    }
    throw new BadRequestException('Invalid credentials');
  }

  async register(
    signupRequestDto: SignupRequestDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const exists = await this.userRepository.findOne({
      email: signupRequestDto.email,
    });

    if (exists) {
      throw new BadRequestException('User with the email already exists');
    }
    const hashedPassword = await bcrypt.hash(signupRequestDto.password, 12);
    const entity = this.mapper.map(signupRequestDto, SignupRequestDto, User);

    entity.password = hashedPassword;

    const newUser = await this.userRepository.createEntity(entity);
    return this.generateTokens(newUser);
  }

  async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessTokenPayload = {
      username: user.email,
      sub: user._id,
      role: user.role,
    };
    const refreshTokenPayload = { sub: user._id };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    await this.userRepository.updateEntity(user._id.toString(), {
      refresh_token: refreshToken,
    });

    const loginResponseDto = new LoginResponseDto();
    loginResponseDto.access_token = accessToken;
    loginResponseDto.refresh_token = refreshToken;

    return loginResponseDto;
  }

  async login(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.generateTokens(user);
  }

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({ _id: payload.sub });

      if (!user || user.refresh_token !== oldRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.updateEntity(userId, { refresh_token: '' });
    return { message: 'User logged out successfully' };
  }
}
