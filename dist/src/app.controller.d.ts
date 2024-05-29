import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    sendEmail(abstractFile: any, formData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
