import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    hash: number;

    @Column()
    title: string;

    @Column()
    order: number;

    @Column()
    uri: string;
}
