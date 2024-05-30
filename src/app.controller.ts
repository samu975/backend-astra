// app.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-email')
  @UseInterceptors(FileInterceptor('abstractFile'))
  async sendEmail(@UploadedFile() abstractFile, @Body() formData) {
    if (!abstractFile) {
      console.log('No file attached');
      return { success: false, message: 'No file attached' };
    }

    const emailData = {
      // to: 'voyagerudea@gmail.com',
      to: 'ange5111@outlook.com',
      subject: 'Submission form',
      html: `
        <p>Autores: ${formData.authors}</p>
        <p>Email: ${formData.email}</p>
        <p>Pais: ${formData.country}</p>
        <p>Institución: ${formData.institution}</p>
        <p>Titulo del abstract: ${formData.abstractTitle}</p>
      `,
      attachments: [
        {
          filename: `${formData.abstractTitle}-${formData.authors}.pdf`,
          path: abstractFile.location, // Usar la URL proporcionada por multer-S3
          contentType: abstractFile.mimetype,
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
