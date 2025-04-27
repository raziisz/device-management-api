import { CreateDeviceInput } from '@/devices/application/usecase/create-device.usecase';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export class NewDeviceDto implements CreateDeviceInput {
  @ApiProperty({ description: 'Category ID of the device' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
  @ApiProperty({ description: 'Color of the device' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-ZÀ-ÿ\s]*$/, {
    message: 'Color must contain only letters',
  })
  color: string;
  @ApiProperty({ description: 'Part number of the device' })
  @IsNotEmpty()
  @IsNumberString()
  partNumber: string;
}
