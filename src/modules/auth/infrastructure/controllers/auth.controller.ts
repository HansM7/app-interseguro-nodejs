import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequestDto } from '../../application/dtos/login-request.dto';
import { LogoutRequestDto } from '../../application/dtos/logout-request.dto';
import { RefreshRequestDto } from '../../application/dtos/refresh-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and get tokens' })
  @ApiResponse({ status: 201, description: 'Successful login.' })
  @ApiResponse({ status: 401, description: 'Invalid password or user not found.' })
  @ApiResponse({ status: 403, description: 'User already logged in.' })
  async login(@Body() body: LoginRequestDto) {
    return this.authUseCase.login(body);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Logout and invalidate session' })
  @ApiResponse({ status: 201, description: 'Logged out successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async logout(@Req() req: any, @Body() body: LogoutRequestDto) {
    if (!body.refreshToken) {
      throw new Error('Refresh token is required');
    }
    await this.authUseCase.logout(req.user.id, body.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 201, description: 'Returns new access token.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  async refresh(@Body() body: RefreshRequestDto) {
    if (!body.refreshToken) {
      throw new Error('Refresh token is required');
    }
    return this.authUseCase.refresh(body.refreshToken);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed test user' })
  @ApiResponse({ status: 201, description: 'Seed executed successfully.' })
  async seed() {
    return this.authUseCase.seed();
  }
}