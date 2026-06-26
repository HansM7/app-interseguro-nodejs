import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/config/auth.module';
import { MatrixModule } from './modules/matrix/config/matrix.module';

@Module({
  imports: [AuthModule, MatrixModule],
})
export class AppModule {}
