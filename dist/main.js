"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_module_1 = require("./user/user.module");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const materials_module_1 = require("./materials/materials.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("/api/v1").useGlobalPipes(new common_1.ValidationPipe());
    const options = new swagger_1.DocumentBuilder()
        .setTitle("API")
        .setDescription("API description")
        .setVersion("1.0")
        .addTag("API")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options, {
        include: [user_module_1.UserModule, materials_module_1.MaterialsModule],
    });
    swagger_1.SwaggerModule.setup("api", app, document);
    const corsOptions = {
        origin: (origin, callback) => {
            const whitelist = ['https://www.sfwl.org', 'http://localhost:3000'];
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Accept, Authorization",
        credentials: true,
    };
    app.enableCors(corsOptions);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map