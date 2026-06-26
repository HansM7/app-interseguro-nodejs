import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class MatrixStatsRequestDto {
  @ApiProperty({
    description: 'Matriz Q resultante de la factorización QR',
    example: [
      [0.8571, -0.3943],
      [0.4286, 0.9029],
      [-0.2857, 0.1714]
    ]
  })
  @IsArray()
  Q: number[][];

  @ApiProperty({
    description: 'Matriz R resultante de la factorización QR',
    example: [
      [14, 21],
      [0, 175]
    ]
  })
  @IsArray()
  R: number[][];
}
