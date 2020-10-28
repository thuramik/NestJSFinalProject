import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class LessonsAddVideo {
    @ApiProperty({ example: '1' })
    @IsNumber()
    videoHash: number;
}
