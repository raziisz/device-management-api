import { Module } from '@nestjs/common';
import { DevicePrismaRepository } from './database/prisma/repositories/device-prisma.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { CreateDeviceUseCase } from '../application/usecase/create-device.usecase';
import { DeviceRepository } from '../domain/repositories/device.repository';
import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { ListDeviceUseCase } from '../application/usecase/list-device.usecase';
import { DeleteDeviceUseCase } from '../application/usecase/delete-device.usecase';
import { CategoriesModule } from '@/categories/infrastructure/categories.module';
import { DevicesController } from './devices.controller';

@Module({
  imports: [CategoriesModule],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'DeviceRepository',
      useFactory: (prismaService: PrismaService) =>
        new DevicePrismaRepository(prismaService),
      inject: ['PrismaService'],
    },
    {
      provide: CreateDeviceUseCase,
      useFactory: (
        deviceRepository: DeviceRepository,
        categoryRepository: CategoryRepository,
      ) => new CreateDeviceUseCase(deviceRepository, categoryRepository),
      inject: ['DeviceRepository', 'CategoryRepository'],
    },
    {
      provide: ListDeviceUseCase,
      useFactory: (deviceRepository: DeviceRepository) =>
        new ListDeviceUseCase(deviceRepository),
      inject: ['DeviceRepository'],
    },
    {
      provide: DeleteDeviceUseCase,
      useFactory: (deviceRepository: DeviceRepository) =>
        new DeleteDeviceUseCase(deviceRepository),
      inject: ['DeviceRepository'],
    },
  ],
  controllers: [DevicesController],
})
export class DevicesModule {}
