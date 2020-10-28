import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class LessonsAddKeynote {
    @ApiProperty({ example: '1' })
    @IsNumber()
    keynoteHash: number;
}
