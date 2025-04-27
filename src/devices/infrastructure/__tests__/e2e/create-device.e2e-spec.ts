import { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { DeviceRepository } from '@/devices/domain/repositories/device.repository';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NewDeviceDto } from '../../dtos/new-device.dto';
import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DevicesModule } from '../../devices.module';
import { CategoriesModule } from '@/categories/infrastructure/categories.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import request from 'supertest';
import { DeviceEntity } from '@/devices/domain/entities/device.entity';

describe('DevicesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let deviceRepository: DeviceRepository;
  let categoryRepository: CategoryRepository;
  let newDeviceDto: NewDeviceDto;
  let categoryId: number;

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
    categoryRepository = module.get<CategoryRepository>('CategoryRepository');
    deviceRepository = module.get<DeviceRepository>('DeviceRepository');
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
    newDeviceDto = {
      categoryId: categoryId,
      color: 'red',
      partNumber: '123456',
    };

    await prismaService.device.deleteMany();
  });

  afterAll(async () => {
    await prismaService.device.deleteMany();
    await prismaService.category.deleteMany();
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });

  describe('POST /devices', () => {
    it('should create a device', async () => {
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(newDeviceDto)
        .expect(HttpStatus.CREATED);
    });

    it('should return an error with 422 code when the request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send({})
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'categoryId should not be empty',
        'categoryId must be a number conforming to the specified constraints',
        'color must be a string',
        'color should not be empty',
        'partNumber must be a number string',
        'partNumber should not be empty',
      ]);
    });

    it('should return an error with 422 code when the color field is invalid', async () => {
      delete newDeviceDto.color;
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(newDeviceDto)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'color must be a string',
        'color should not be empty',
      ]);
    });
    it('should return an error with 422 code when the partNumber field is invalid', async () => {
      delete newDeviceDto.partNumber;
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(newDeviceDto)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'partNumber must be a number string',
        'partNumber should not be empty',
      ]);
    });
    it('should return an error with 422 code when the categoryId field is invalid', async () => {
      delete newDeviceDto.categoryId;
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(newDeviceDto)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'categoryId should not be empty',
        'categoryId must be a number conforming to the specified constraints',
      ]);
    });
    it('should return a error with 422 code with invalid field provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(Object.assign(newDeviceDto, { invalidField: 'invalid' }))
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.error).toBe('Unprocessable Entity');
      expect(response.body.message).toEqual([
        'property invalidField should not exist',
      ]);
    });
    it('should return a error with 409 code when the partNumber is duplicated', async () => {
      const entity = new DeviceEntity({
        categoryId: categoryId,
        color: 'red',
        partNumber: '123456',
      });
      await deviceRepository.insert(entity);

      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(newDeviceDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.error).toBe('Conflict');
      expect(response.body.message).toEqual('Partnumber already used');
    });
  });
});
