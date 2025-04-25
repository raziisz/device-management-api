import { CreateDeviceInput } from '@/devices/application/usecase/create-device.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class NewDeviceDto implements CreateDeviceInput {
  @ApiProperty({ description: 'Category ID of the device' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
  @ApiProperty({ description: 'Color of the device' })
  @IsNotEmpty()
  @IsString()
  color: string;
  @ApiProperty({ description: 'Part number of the device' })
  @IsPositive()
  @IsNotEmpty()
  partNumber: number;
}
