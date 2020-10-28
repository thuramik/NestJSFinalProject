import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Video} from "./entities/video.entity";
import {CreateVideoDto} from "./dto/create-video.dto";
import {UpdateVideoDto} from "./dto/update-video.dto";

@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>
    ) {}

    async findOne(id: number) {
        const video = await this.videoRepository.findOne(id);
        if (!video) {
            throw new NotFoundException(`Video #${id} not found`);
        }
        return video;
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.videoRepository.find({
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async create(createVideoDto: CreateVideoDto) {
        const video = this.videoRepository.create({
            ...createVideoDto
        });
        return this.videoRepository.save(video);
    }

    async update(hash: number, updateVideoDto: UpdateVideoDto) {
        const video = await this.videoRepository.preload({
            hash: hash,
            ...updateVideoDto,
        });
        if (!video) {
            throw new NotFoundException(`Video #${hash} not found`);
        }
        return this.videoRepository.save(video);
    }

    async remove(id: number) {
        const video = await this.findOne(id);
        return this.videoRepository.remove(video);
    }
}
