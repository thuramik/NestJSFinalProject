import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Class} from "./entities/class.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateClassDto} from "./dto/create-class.dto";
import {UpdateClassDto} from "./dto/update-class.dto";
import {LessonsService} from "../lessons/lessons.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
        private readonly lessonsService: LessonsService,
        private readonly usersService: UsersService
    ) {}

    async findOne(id: number) {
        const classItem = await this.classRepository.findOne(id, {
            relations: ['users', 'lessons'],
        });
        if (!classItem) {
            throw new NotFoundException(`Class #${id} not found`);
        }
        return classItem;
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, page } = paginationQuery;
        return this.classRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['users', 'lessons'],
        });
    }

    async create(createClassDto: CreateClassDto) {
        const classItem = this.classRepository.create({
            ...createClassDto
        });
        return this.classRepository.save(classItem);
    }

    async update(hash: number, updateClassDto: UpdateClassDto) {
        const classItem = await this.classRepository.preload({
            hash: hash,
            ...updateClassDto,
        });
        if (!classItem) {
            throw new NotFoundException(`Class #${hash} not found`);
        }
        return this.classRepository.save(classItem);
    }

    async remove(id: number) {
        const classItem = await this.findOne(id);
        return this.classRepository.remove(classItem);
    }

    async addLessonToClass(classHash: number, lessonHash: number) {
        const lesson = await this.lessonsService.findOne(lessonHash);
        const classItem = await this.findOne(classHash);
        if (classItem.lessons === undefined) {
            classItem.lessons = [];
        }
        classItem.lessons.push(lesson);
        return this.classRepository.save(classItem);
    }

    async deleteLessonFromClass(classHash: number, lessonHash: number) {
        const classItem = await this.findOne(classHash);
        const lesson = classItem.lessons.find(lesson => lesson.hash === lessonHash);
        if (lesson === undefined) {
            throw new NotFoundException(`Lesson #${lessonHash} not found in class #${classHash}`);
        }
        classItem.lessons = classItem.lessons.filter(lesson => lesson.hash !== lessonHash);
        return this.classRepository.save(classItem);
    }

    async enrollStudentToClass(classHash: number, userHash: number) {
        const user = await this.usersService.findOne(userHash);
        const classItem = await this.findOne(classHash);
        if (classItem.users === undefined) {
            classItem.users = [];
        }
        classItem.users.push(user);
        return this.classRepository.save(classItem);
    }

    async expelStudentFromClass(classHash: number, userHash: number) {
        const classItem = await this.findOne(classHash);
        const user = classItem.users.find(user => user.hash === userHash);
        if (user === undefined) {
            throw new NotFoundException(`User #${userHash} not found in class #${classHash}`);
        }
        classItem.users = classItem.users.filter(user => user.hash !== userHash);
        return this.classRepository.save(classItem);
    }
}
