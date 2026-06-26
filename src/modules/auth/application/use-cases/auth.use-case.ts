import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthRepositoryPort } from '../../infrastructure/adapters/ports/auth-repository.port';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { IAuthTokens } from '../../domain/interfaces/auth-tokens.interface';
import { LoginRequestDto } from '../dtos/login-request.dto';

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly jwtService: JwtService
  ) { }

  async login(loginDto: LoginRequestDto): Promise<IAuthTokens> {
    const user = await this.authRepository.findUserByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.logged) {
      throw new ForbiddenException('User already logged in');
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password!);
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.authRepository.updateUserLoggedStatus(user.id, true);

    const accessToken = this.jwtService.sign({ id: user.id, username: user.username }, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ id: user.id }, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.createSession(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async logout(userId: number, refreshToken: string): Promise<void> {
    await this.authRepository.deleteSession(refreshToken);
    await this.authRepository.updateUserLoggedStatus(userId, false);
  }

  async refresh(refreshToken: string): Promise<IAuthTokens> {
    const session = await this.authRepository.findSessionByToken(refreshToken);
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const accessToken = this.jwtService.sign({ id: session.user.id, username: session.user.username }, { expiresIn: '1h' });
    return { accessToken };
  }

  async seed(): Promise<any> {
    const password = await bcrypt.hash('password123', 10);
    const user = await this.authRepository.seedUser({
      username: 'testuser',
      password,
      logged: false,
    });
    return { message: 'Seed executed successfully', user };
  }
}
