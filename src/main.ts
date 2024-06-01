import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { ProductModule } from "./product/product.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("/api/v1").useGlobalPipes(new ValidationPipe()
  );
  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("API")
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule, ProductModule],
  });
  SwaggerModule.setup("api", app, document);

  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  }

  app.enableCors(corsOptions);

  const PORT = process.env.PORT;
  console.log('Application is running on: http://localhost:3000');
  await app.listen(PORT);
}

bootstrap();
