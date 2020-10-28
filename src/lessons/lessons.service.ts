import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Lesson} from "./entities/lesson.entity";
import {UpdateLessonDto} from "./dto/update-lesson.dto";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {VideosService} from "../videos/videos.service";
import {Video} from "../videos/entities/video.entity";
import {KeynotesService} from "../keynotes/keynotes.service";

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
        private readonly videosService: VideosService,
        private readonly keynotesService: KeynotesService
    ) {}

    async findOne(hash: number) {
        const lesson = await this.lessonRepository.findOne(hash, {
            relations: [
                'content.videos',
                'content.keynotes',
            ],
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson #${hash} not found`);
        }
        return lesson;
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.lessonRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            relations: [
                'content.videos',
                'content.keynotes',
            ],
        });
    }

    async create(createLessonDto: CreateLessonDto) {
        let videos = [];
        let keynotes = [];

        if (createLessonDto.content !== undefined) {
            if (createLessonDto.content.videos !== undefined) {
                videos = await Promise.all(
                    createLessonDto.content.videos.map(hash => this.preloadVideoByHash(hash)),
                );
            }
            if (createLessonDto.content.keynotes !== undefined) {
                keynotes = await Promise.all(
                    createLessonDto.content.keynotes.map(hash => this.preloadKeynoteByHash(hash)),
                );
            }
        }

        const lesson = this.lessonRepository.create({
            ...createLessonDto,
            content: {
                videos,
                keynotes
            },
        });
        return this.lessonRepository.save(lesson);
    }

    async update(hash: number, updateLessonDto: UpdateLessonDto) {
        const videos = await Promise.all(
            updateLessonDto.content.videos.map(hash => this.preloadVideoByHash(hash)),
        );
        const keynotes = await Promise.all(
            updateLessonDto.content.keynotes.map(hash => this.preloadKeynoteByHash(hash)),
        );

        const lesson = await this.lessonRepository.preload({
            hash: hash,
            ...updateLessonDto,
            content: {
                videos,
                keynotes
            },
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson #${hash} not found`);
        }
        return this.lessonRepository.save(lesson);
    }

    async remove(id: number) {
        const lesson = await this.findOne(id);
        return this.lessonRepository.remove(lesson);
    }

    async addVideoToLesson(lessonHash: number, videoHash: number) {
        const video = await this.videosService.findOne(videoHash);
        const lesson = await this.findOne(lessonHash);
        if (lesson.content.videos === undefined) {
            lesson.content.videos = [];
        }
        lesson.content.videos.push(video);
        return this.lessonRepository.save(lesson);
    }

    async addKeynoteToLesson(lessonHash: number, keynoteHash: number) {
        const keynote = await this.keynotesService.findOne(keynoteHash);
        const lesson = await this.findOne(lessonHash);
        if (lesson.content.keynotes === undefined) {
            lesson.content.keynotes = [];
        }
        lesson.content.keynotes.push(keynote);
        return this.lessonRepository.save(lesson);
    }

    async getVideoOfLesson(lessonHash: number, videoHash: number) {
        const lesson = await this.findOne(lessonHash);
        const video = lesson.content.videos.find(video => video.hash === videoHash);
        if (video === undefined) {
            throw new NotFoundException(`Video #${videoHash} not found in lesson #${lessonHash}`);
        }
        return video;
    }

    async deleteVideoFromLesson(lessonHash: number, videoHash: number) {
        const lesson = await this.findOne(lessonHash);
        const video = lesson.content.videos.find(video => video.hash === videoHash);
        if (video === undefined) {
            throw new NotFoundException(`Video #${videoHash} not found in lesson #${lessonHash}`);
        }
        lesson.content.videos = lesson.content.videos.filter(video => video.hash !== videoHash);
        return this.lessonRepository.save(lesson);
    }

    async getKeynoteOfLesson(lessonHash: number, keynoteHash: number) {
        const lesson = await this.findOne(lessonHash);
        const keynote = lesson.content.keynotes.find(keynote => keynote.hash === keynoteHash);
        if (keynote === undefined) {
            throw new NotFoundException(`Keynote #${keynoteHash} not found in lesson #${lessonHash}`);
        }
        return keynote;
    }

    async deleteKeynoteFromLesson(lessonHash: number, keynoteHash: number) {
        const lesson = await this.findOne(lessonHash);
        const keynote = lesson.content.keynotes.find(keynote => keynote.hash === keynoteHash);
        if (keynote === undefined) {
            throw new NotFoundException(`Keynote #${keynoteHash} not found in lesson #${lessonHash}`);
        }
        lesson.content.keynotes = lesson.content.keynotes.filter(keynote => keynote.hash !== keynoteHash);
        return this.lessonRepository.save(lesson);
    }

    private async preloadVideoByHash(hash: number): Promise<Video> {
        const existingVideo = await this.videosService.findOne(hash);
        if (existingVideo) {
            return existingVideo;
        }
    }

    private async preloadKeynoteByHash(hash: number): Promise<Video> {
        const existingKeynote = await this.keynotesService.findOne(hash);
        if (existingKeynote) {
            return existingKeynote;
        }
    }
}
