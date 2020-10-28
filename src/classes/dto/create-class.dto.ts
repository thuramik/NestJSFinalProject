import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNumber, IsObject, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";

class Duration {
    @IsDate()
    started: Date;

    @IsDate()
    closed: Date;
}

export class CreateClassDto {
    @ApiProperty({ example: 'Backend' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Backend Online Course' })
    @IsString()
    description: string;

    @ApiProperty({ example: '2' })
    @IsNumber()
    @Min(1)
    @Max(9999)
    order: number;

    @ApiProperty({ example: '{\'started: 2019-06-19T07:44:06.353Z\', \'closed\': 2019-06-19T07:44:06.353Z}' })
    @Type(() => Duration)
    @IsObject()
    duration: Duration;
}
