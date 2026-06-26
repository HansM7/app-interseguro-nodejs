import { Controller, Post, Body, UseGuards, BadRequestException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CalculateStatsUseCase } from '../../application/use-cases/calculate-stats.use-case';
import { AuthGuard } from '@nestjs/passport';
import { MatrixStatsRequestDto } from '../../application/dtos/matrix-stats-request.dto';
import { MatrixStatsResponseDto } from '../../application/dtos/matrix-stats-response.dto';

@ApiTags('Matrix')
@Controller('matrices')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MatrixController {
  constructor(private readonly calculateStatsUseCase: CalculateStatsUseCase) { }

  @Post('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate statistics on Q and R matrices' })
  @ApiResponse({ status: 200, description: 'Returns calculated statistics.', type: MatrixStatsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request (invalid payload).' })
  calculateStats(@Body() body: MatrixStatsRequestDto): MatrixStatsResponseDto {
    return this.calculateStatsUseCase.execute(body);
  }
}