async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Define CORS options to allow all origins
  const corsOptions: CorsOptions = {
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true, // Allow cookies/auth headers
  };

  app.enableCors(corsOptions);

  // Use the PORT environment variable or default to 3000
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}

bootstrap();
