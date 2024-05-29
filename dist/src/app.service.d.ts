import { MailerService } from '@nestjs-modules/mailer';
export declare class AppService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmail(emailData: any): Promise<void>;
    getHello(): string;
}
