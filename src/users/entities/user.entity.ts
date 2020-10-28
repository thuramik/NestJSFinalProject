import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Class} from "../../classes/entities/class.entity";

export enum UserSex {
    MALE = "m",
    FEMALE = "f"
}

export enum UserRole {
    NEWBIE = "newbie",
    STUDENT = "student",
    TEACHER = "teacher"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    hash: number;

    @ApiProperty({ example: 'Yurii Z' })
    @Column()
    name: string;

    @ApiProperty({ example: 'dev3yuroii.z@alldigitalads.com' })
    @Column()
    email: string;

    @ApiProperty({ example: '+380669996655' })
    @Column()
    phone: string;

    @ApiProperty({ example: 'ab12345Cd' })
    @Column()
    password: string;

    @ApiProperty({ example: 'm' })
    @Column({
        type: "enum",
        enum: UserSex
    })
    sex: UserSex

    @ApiProperty({ example: 'newbie' })
    @Column({
        type: "enum",
        enum: UserRole
    })
    role: UserRole

    @ManyToOne(() => Class, classItem => classItem.users)
    classes: Class[];
}
