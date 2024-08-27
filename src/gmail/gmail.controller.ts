import { Controller, Get, Param } from '@nestjs/common';
import { GmailService } from './gmail.service';

@Controller('gmails')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get()
  getAllEmails() {
    return this.gmailService.getAllEmails();
  }

  @Get(':id')
  getEmail(@Param('id') id: string) {
    return this.gmailService.getEmail(id);
  }

  @Get(':id/html')
  getEmailHtml(@Param('id') id: string) {
    return this.gmailService.getEmailHtml(id);
  }
}
