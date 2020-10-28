import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class StudentExpel {
    @ApiProperty({ example: '1' })
    @IsNumber()
    userHash: number;
}
