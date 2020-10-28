import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";
import {WrapResponseInterceptor} from "./common/interceptors/wrap-response.interceptor";
import {TimeoutInterceptor} from "./common/interceptors/timeout.interceptor";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimeoutInterceptor());

  // Setting up Swagger document
  const options = new DocumentBuilder()
      .setTitle('Backend Course API by dev3yurii.z')
      .setDescription('Backend Course API')
      .setVersion('9.9')
      .addCookieAuth('user')
      .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
