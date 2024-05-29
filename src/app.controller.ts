// app.controller.ts
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send-email')
  @UseInterceptors(FileInterceptor('abstractFile'))
  async sendEmail(@UploadedFile() abstractFile, @Body() formData) {
    if (!abstractFile) {
      console.log('No file attached');
      return { success: false, message: 'No file attached' };
    }

    const emailData = {
      to: 'saferoxx215@gmail.com',
      subject: 'Submision form',
      html: `
        <p>Autores: ${formData.authors}</p>
        <p>Email: ${formData.email}</p>
        <p>Pais: ${formData.country}</p>
        <p>Institución: ${formData.institution}</p>
        <p>Titulo del abstract: ${formData.abstractTitle}</p>
      `,
      attachments: [
        {
          content: abstractFile,
          filename: `${formData.abstractTitle}-${formData.authors}.pdf`,
          type: abstractFile.mimetype,
          disposition: 'attachment',
        },
      ],
    };

    try {
      await this.appService.sendEmail(emailData);
      console.log('Email sent successfully');
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }
}