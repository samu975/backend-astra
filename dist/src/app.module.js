"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const platform_express_1 = require("@nestjs/platform-express");
const client_s3_1 = require("@aws-sdk/client-s3");
const multerS3 = require('multer-s3');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            platform_express_1.MulterModule.registerAsync({
                useFactory: () => {
                    const s3 = new client_s3_1.S3Client({
                        credentials: {
                            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                        },
                        region: process.env.AWS_REGION,
                    });
                    common_1.Logger.log('Configurando S3:', JSON.stringify(s3.config));
                    return {
                        storage: multerS3({
                            s3,
                            bucket: 'abstracts-uploads',
                            contentType: multerS3.AUTO_CONTENT_TYPE,
                            key: (req, file, cb) => {
                                cb(null, Date.now().toString() + '-' + file.originalname);
                            },
                        }),
                    };
                },
            }),
            mailer_1.MailerModule.forRoot({
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
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map