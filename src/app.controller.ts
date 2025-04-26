import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `Oi, eu sou a aplicação Device Management API - ${new Date().toISOString()}`;
  }
}
