import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Lesson} from "./entities/lesson.entity";
import {VideosModule} from "../videos/videos.module";
import {KeynotesModule} from "../keynotes/keynotes.module";

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), VideosModule, KeynotesModule],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
