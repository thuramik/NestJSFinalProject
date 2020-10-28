import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Class} from "./entities/class.entity";
import {LessonsModule} from "../lessons/lessons.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Class]), LessonsModule, UsersModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
