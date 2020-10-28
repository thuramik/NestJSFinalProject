import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Video} from "../../videos/entities/video.entity";
import {User} from "../../users/entities/user.entity";
import {Lesson} from "../../lessons/entities/lesson.entity";

class Duration {
    started: Date;
    closed: Date;
}

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    hash: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column(() => Duration)
    duration: Duration = new Duration();

    @OneToMany(() => User, user => user.classes)
    users: User[];

    @OneToMany(() => Lesson, lesson => lesson.classes)
    lessons: Lesson[];
}
