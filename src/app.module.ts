import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { CategoriesModule } from './categories/infrastructure/categories.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, CategoriesModule],
  controllers: [AppController],
})
export class AppModule {}
