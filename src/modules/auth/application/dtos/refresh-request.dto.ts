import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...', description: 'The refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
