import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { CategoriesModule } from './categories/infrastructure/categories.module';
import { DevicesModule } from './devices/infrastructure/devices.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, CategoriesModule, DevicesModule],
  controllers: [AppController],
})
export class AppModule {}
