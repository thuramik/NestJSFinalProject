import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findByEmail(email: string) {
        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    async findOne(hash: number) {
        const user = await this.userRepository.findOne(hash);
        if (!user) {
            throw new NotFoundException(`User #${hash} not found`);
        }
        return user;
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.userRepository.find({
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create({
            ...createUserDto
        });
        return this.userRepository.save(user);
    }

    async update(hash: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.preload({
            hash: hash,
            ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException(`User #${hash} not found`);
        }
        return this.userRepository.save(user);
    }

    async remove(hash: number) {
        const coffee = await this.findOne(hash);
        return this.userRepository.remove(coffee);
    }
}
