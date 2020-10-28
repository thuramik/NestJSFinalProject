import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { LessonsModule } from './lessons/lessons.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { VideosModule } from './videos/videos.module';
import { KeynotesModule } from './keynotes/keynotes.module';

@Module({
  imports: [
      TypeOrmModule.forRootAsync({
          useFactory: () => ({
              type: 'postgres',
              host: process.env.DATABASE_HOST,
              port: +process.env.DATABASE_PORT,
              username: process.env.DATABASE_USER,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE_NAME,
              autoLoadEntities: true,
              synchronize: true,
          }),
      }),
      ConfigModule.forRoot({
          load: [appConfig],
      }),
      CommonModule,
      UsersModule,
      ClassesModule,
      LessonsModule,
      AuthModule,
      VideosModule,
      KeynotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
