import { Injectable } from '@nestjs/common';
import { MatrixStatsRequestDto } from '../dtos/matrix-stats-request.dto';
import { MatrixStatsResponseDto } from '../dtos/matrix-stats-response.dto';

@Injectable()
export class CalculateStatsUseCase {
  execute(dto: MatrixStatsRequestDto): MatrixStatsResponseDto {
    const matrices = [dto.Q, dto.R];
    let max = -Infinity;
    let min = Infinity;
    let sum = 0;
    let count = 0;
    let isAnyDiagonal = false;

    for (const matrix of matrices) {
      if (!matrix || matrix.length === 0) continue;

      if (!isAnyDiagonal && this.isDiagonal(matrix)) {
        isAnyDiagonal = true;
      }

      for (const row of matrix) {
        for (const val of row) {
          if (val > max) max = val;
          if (val < min) min = val;
          sum += val;
          count++;
        }
      }
    }

    if (count === 0) {
      return { max: null, min: null, average: 0, sum: 0, isDiagonal: false };
    }

    return {
      max,
      min,
      average: sum / count,
      sum,
      isDiagonal: isAnyDiagonal,
    };
  }

  private isDiagonal(matrix: number[][]): boolean {
    const rows = matrix.length;
    if (rows === 0) return false;
    const cols = matrix[0].length;

    if (rows !== cols) return false;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i !== j && matrix[i][j] !== 0) return false;
      }
    }
    return true;
  }
}