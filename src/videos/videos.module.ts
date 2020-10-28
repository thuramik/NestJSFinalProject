import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Video} from "./entities/video.entity";
import {VideosController} from "./videos.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService]
})
export class VideosModule {}
