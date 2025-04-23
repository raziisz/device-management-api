import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';

@Module({
  imports: [EnvConfigModule],
  controllers: [AppController],
})
export class AppModule {}
