import { Module } from '@nestjs/common';
import { MatrixController } from '../infrastructure/controllers/matrix.controller';
import { CalculateStatsUseCase } from '../application/use-cases/calculate-stats.use-case';

@Module({
  controllers: [MatrixController],
  providers: [CalculateStatsUseCase],
})
export class MatrixModule {}