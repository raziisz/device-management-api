import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ListDeviceOutput,
  ListDeviceUseCase,
} from '../application/usecase/list-device.usecase';
import { CreateDeviceUseCase } from '../application/usecase/create-device.usecase';
import { DeleteDeviceUseCase } from '../application/usecase/delete-device.usecase';
import {
  DeviceCollectionPresenter,
  DevicePresenter,
} from './presenters/device.presenter';
import { ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ListDeviceDto } from './dtos/list-device.dto';
import { NewDeviceDto } from './dtos/new-device.dto';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

@Controller('devices')
export class DevicesController {
  @Inject(ListDeviceUseCase)
  private listDeviceUseCase: ListDeviceUseCase;

  @Inject(CreateDeviceUseCase)
  private createDeviceUseCase: CreateDeviceUseCase;

  @Inject(DeleteDeviceUseCase)
  private deleteDeviceUseCase: DeleteDeviceUseCase;

  static listDeviceToResponse(output: ListDeviceOutput) {
    return new DeviceCollectionPresenter(output);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devices list',
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { type: 'object', $ref: getSchemaPath(DevicePresenter) },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'List all devices with pagination and filtering',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async read(@Query() searchParams: ListDeviceDto) {
    const output = await this.listDeviceUseCase.execute(searchParams);
    return DevicesController.listDeviceToResponse(output);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Device created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Device already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid data',
  })
  @ApiOperation({
    summary: 'Create a new device',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() newDeviceDto: NewDeviceDto) {
    try {
      await this.createDeviceUseCase.execute(newDeviceDto);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Device deleted',
  })
  @ApiOperation({
    summary: 'Delete a device',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Device not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteDeviceUseCase.execute({ id });
  }
}
