// import { ValidationPipe, Logger } from "@nestjs/common";
// import { NestFactory } from "@nestjs/core";
// import { UserModule } from "./user/user.module";
// import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
// import { AppModule } from "./app.module";
// import { MaterialsModule } from "./materials/materials.module";

// async function bootstrap() {
//   // const app = await NestFactory.create(AppModule);
//   const app = await NestFactory.create(AppModule, {
//     logger: ['error', 'debug'], // Enable all log levels
//   });

//   const logger = new Logger('Bootstrap');

//   app.setGlobalPrefix("/api/v1").useGlobalPipes(new ValidationPipe());

//   const options = new DocumentBuilder()
//     .setTitle("API")
//     .setDescription("API description")
//     .setVersion("1.0")
//     .addTag("API")
//     .build();

//   const document = SwaggerModule.createDocument(app, options, {
//     include: [UserModule, MaterialsModule],
//   });

//   SwaggerModule.setup("api", app, document);

//   // Define CORS options to allow all origins
//   const corsOptions: CorsOptions = {
//     origin: "*", // Allow all origins
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: "Content-Type, Accept, Authorization",
//     credentials: true, // Allow cookies/auth headers
//   };

//   app.enableCors(corsOptions);

//   const PORT = process.env.PORT || 3000;
//   await app.listen(PORT);
//   logger.log(`Application is running on: http://localhost:${PORT}`);
//   // console.log(`Application is running on: http://localhost:${PORT}`);
// }

// bootstrap();


import { ValidationPipe, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { MaterialsModule } from "./materials/materials.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug'], // Enable only error and debug logs
  });

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix("/api/v1").useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("API")
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule, MaterialsModule],
  });

  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  const logMessage = `Application is running on: http://localhost:${PORT}`;
  logger.log(logMessage);
  console.log(logMessage); // Output logged message to console
}

bootstrap();
