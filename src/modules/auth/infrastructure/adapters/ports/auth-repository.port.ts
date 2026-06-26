import { IUser } from '../../../domain/interfaces/user.interface';

export abstract class AuthRepositoryPort {
  abstract findUserByUsername(username: string): Promise<IUser | null>;
  abstract updateUserLoggedStatus(userId: number, logged: boolean): Promise<void>;
  abstract createSession(userId: number, refreshToken: string, expiresAt: Date): Promise<void>;
  abstract findSessionByToken(refreshToken: string): Promise<any | null>;
  abstract deleteSession(refreshToken: string): Promise<void>;
}