import { Injectable } from '@nestjs/common';
import { AuthRepositoryPort } from '../ports/auth-repository.port';
import { PrismaService } from '../../../../../prisma.service';
import { IUser } from '../../../domain/interfaces/user.interface';

@Injectable()
export class AuthRepositoryImpl implements AuthRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUsername(username: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async updateUserLoggedStatus(userId: number, logged: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { logged },
    });
  }

  async createSession(userId: number, refreshToken: string, expiresAt: Date): Promise<void> {
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
      },
    });
  }

  async findSessionByToken(refreshToken: string): Promise<any | null> {
    return this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  }

  async deleteSession(refreshToken: string): Promise<void> {
    await this.prisma.session.delete({ where: { refreshToken } });
  }
}