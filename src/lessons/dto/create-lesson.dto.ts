import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";


class Content {
    @ApiProperty({ example: '1' })
    @IsNumber({},{each:true})
    videos: number[];

    @ApiProperty({ example: '2' })
    @IsNumber({},{each:true})
    keynotes: number[];
}

export class CreateLessonDto {
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

    @Type(() => Content)
    content: Content;
}
