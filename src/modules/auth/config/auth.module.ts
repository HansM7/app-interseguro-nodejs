import { Module } from '@nestjs/common';
import { AuthController } from '../infrastructure/controllers/auth.controller';
import { AuthUseCase } from '../application/use-cases/auth.use-case';
import { PrismaService } from '../../../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../../config/jwt.strategy';
import { AuthRepositoryPort } from '../infrastructure/adapters/ports/auth-repository.port';
import { AuthRepositoryImpl } from '../infrastructure/adapters/implements/auth-repository.impl';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_token',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    PrismaService,
    JwtStrategy,
    {
      provide: AuthRepositoryPort,
      useClass: AuthRepositoryImpl,
    },
  ],
})
export class AuthModule { }