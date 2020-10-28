import {ApiProperty} from "@nestjs/swagger";
import {UserRole, UserSex} from "../entities/user.entity";
import {IsString} from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'Yurii Z' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'dev3yuroii.z@alldigitalads.com' })
    @IsString()
    email: string;

    @ApiProperty({ example: '+380669996655' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'ab12345Cd' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'm' })
    @IsString()
    sex: UserSex

    @ApiProperty({ example: 'newbie' })
    @IsString()
    role: UserRole
}