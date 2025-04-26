import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DevicesModule } from '../../devices.module';
import { CategoriesModule } from '@/categories/infrastructure/categories.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';
import { DeviceModelMapper } from '../../database/prisma/repositories/models/device-model.mapper';
import request from 'supertest';

describe('DevicesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let categoryId: number;
  let deviceEntity: DeviceEntity;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        DevicesModule,
        CategoriesModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    const categoryModel = await prismaService.category.create({
      data: {
        name: 'Category 1',
      },
    });
    categoryId = categoryModel.id;
  });

  beforeEach(async () => {
    await prismaService.device.deleteMany();

    const model = await prismaService.device.create({
      data: {
        category_id: categoryId,
        color: 'Any color',
        part_number: 123,
        created_at: new Date(),
      },
    });

    deviceEntity = DeviceModelMapper.toEntity(model);
  });

  afterAll(async () => {
    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });

  describe('DELETE /devices/:id', () => {
    it('should delete a device', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/devices/${deviceEntity.id}`)
        .expect(HttpStatus.NO_CONTENT)
        .expect({});
    });
    it('should return an error with 404 code when throw NotFoundError with invalid id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/devices/12345`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Device not found',
          error: 'Not Found',
        });
    });
  });
});
