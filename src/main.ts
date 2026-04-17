// import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config= new DocumentBuilder()
  .setTitle('Banking API')
  .setDescription('Api documentation for Banking API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
