// app.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(emailData: any) {
    await this.mailerService.sendMail(emailData);
  }
}
