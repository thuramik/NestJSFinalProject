import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Keynote} from "./entities/keynote.entity";
import {CreateKeynoteDto} from "./dto/create-keynote.dto";
import {UpdateKeynoteDto} from "./dto/update-keynote.dto";

@Injectable()
export class KeynotesService {
    constructor(
        @InjectRepository(Keynote)
        private readonly keynoteRepository: Repository<Keynote>
    ) {}

    async findOne(id: number) {
        const keynote = await this.keynoteRepository.findOne(id);
        if (!keynote) {
            throw new NotFoundException(`Keynote #${id} not found`);
        }
        return keynote;
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.keynoteRepository.find({
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async create(createKeynoteDto: CreateKeynoteDto) {
        const keynote = this.keynoteRepository.create({
            ...createKeynoteDto
        });
        return this.keynoteRepository.save(keynote);
    }

    async update(hash: number, updateKeynoteDto: UpdateKeynoteDto) {
        const keynote = await this.keynoteRepository.preload({
            hash: hash,
            ...updateKeynoteDto,
        });
        if (!keynote) {
            throw new NotFoundException(`Keynote #${hash} not found`);
        }
        return this.keynoteRepository.save(keynote);
    }

    async remove(id: number) {
        const keynote = await this.findOne(id);
        return this.keynoteRepository.remove(keynote);
    }
}
