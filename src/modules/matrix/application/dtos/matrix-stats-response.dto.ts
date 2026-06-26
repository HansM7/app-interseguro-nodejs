import { ApiProperty } from '@nestjs/swagger';
import { IMatrixStats } from '../../domain/interfaces/matrix-stats.interface';

export class MatrixStatsResponseDto implements IMatrixStats {
  @ApiProperty({ example: 175, description: 'Valor máximo encontrado' })
  max: number | null;

  @ApiProperty({ example: -0.3943, description: 'Valor mínimo encontrado' })
  min: number | null;

  @ApiProperty({ example: 21.32835, description: 'Promedio de todos los valores' })
  average: number;

  @ApiProperty({ example: 211.2385, description: 'Suma de todos los valores' })
  sum: number;

  @ApiProperty({ example: false, description: 'Verdadero si alguna de las matrices (Q o R) es diagonal' })
  isDiagonal: boolean;
}
