import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const multerS3 = require('multer-s3');

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.registerAsync({
      useFactory: () => {
        const s3 = new S3Client({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          region: process.env.AWS_REGION,
        });

        // Log the S3 configuration
        Logger.log('Configurando S3:', JSON.stringify(s3.config));

        return {
          storage: multerS3({
            s3,
            bucket: 'abstracts-uploads',
            contentType: multerS3.AUTO_CONTENT_TYPE, // Optional, sets file content type
            key: (req, file, cb) => {
              cb(null, Date.now().toString() + '-' + file.originalname);
            },
          }),
        };
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      defaults: {
        from: 'safero99@hotmail.com',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
