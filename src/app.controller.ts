import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  health() {
    return { ok: true };
  }

  @Get('/invoices/secret-example')
  invoice() {
    return { pdf: 'fake' };
  }
}
