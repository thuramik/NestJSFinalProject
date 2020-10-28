import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class StudentEnroll {
    @ApiProperty({ example: '1' })
    @IsNumber()
    userHash: number;
}
