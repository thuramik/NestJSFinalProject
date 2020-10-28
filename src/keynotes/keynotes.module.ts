import { Module } from '@nestjs/common';
import { KeynotesService } from './keynotes.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Keynote} from "./entities/keynote.entity";
import {KeynotesController} from "./keynotes.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Keynote])],
  controllers: [KeynotesController],
  providers: [KeynotesService],
  exports: [KeynotesService],
})
export class KeynotesModule {}
