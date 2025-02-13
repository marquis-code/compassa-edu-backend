
import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { ServeStaticModule } from "@nestjs/serve-static";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ImageModule } from "./image/image.module";
import { MulterModule } from "@nestjs/platform-express";

import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { configureCloudinary } from "./cloudinary.config";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { UploadModule } from './upload/upload.module';
import { MaterialsModule } from './materials/materials.module';
import { GroupsModule } from './group/group.module';
import { AuditTrailModule } from "./audit/audit.module";
import { MessagesModule } from './message/messages.module';
import { SharedModule } from './shared.module';
import { GatewayModule } from './gateways/gateway.module';
import * as multer from "multer";

import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    CloudinaryModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported here
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
      serveStaticOptions: { index: false },
    }),
    ImageModule,
    AuthModule,
    UploadModule,
    MaterialsModule,
    AuthModule,
    UserModule,
    ImageModule,
    GroupsModule,
    MessagesModule,
    GatewayModule,
    SharedModule, // Import SharedModule
    AuditTrailModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    CloudinaryService,
    {
      provide: "Cloudinary",
      useFactory: configureCloudinary,
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
