import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Content} from "./content.entity";
import {Class} from "../../classes/entities/class.entity";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    hash: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column(() => Content)
    content: Content = new Content();

    @ManyToOne(() => Class, classItem => classItem.users)
    classes: Class[];
}
