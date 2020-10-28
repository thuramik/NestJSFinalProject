import { JoinTable, ManyToMany } from 'typeorm';
import {Video} from "../../videos/entities/video.entity";
import {Keynote} from "../../keynotes/entities/keynote.entity";

export class Content {
    @ManyToMany(() => Video)
    @JoinTable()
    videos: Video[];

    @ManyToMany(() => Keynote)
    @JoinTable()
    keynotes: Keynote[];
}