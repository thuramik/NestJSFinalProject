import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class ClassAddLesson {
    @ApiProperty({ example: '1' })
    @IsNumber()
    lessonHash: number;
}
