import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsString} from "class-validator";

export enum UserSex {
    MALE = "m",
    FEMALE = "f"
}

export enum UserRole {
    NEWBIE = "newbie",
    STUDENT = "student",
    TEACHER = "teacher"
}

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
    @IsEnum(UserSex)
    sex: UserSex

    @ApiProperty({ example: 'newbie' })
    @IsEnum(UserRole)
    role: UserRole
}