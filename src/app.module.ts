import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule],
  controllers: [AppController],
})
export class AppModule {}
