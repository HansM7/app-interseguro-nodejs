import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutRequestDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...', description: 'The refresh token to invalidate' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
