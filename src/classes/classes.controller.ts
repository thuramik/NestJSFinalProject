import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query
} from '@nestjs/common';
import {ApiCookieAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateClassDto} from "./dto/create-class.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {ParseIntPipe} from "../common/pipes/parse-int.pipe";
import {UpdateClassDto} from "./dto/update-class.dto";
import {ClassesService} from "./classes.service";
import {ClassAddLesson} from "./dto/class-add-lesson.dto";
import {throwError} from "rxjs";
import {StudentEnroll} from "./dto/student-enroll.dto";
import {StudentExpel} from "./dto/student-expel.dto";

@ApiTags('Classes')
@ApiCookieAuth()
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) {}

    @Post()
    async create(@Body() createClassDto: CreateClassDto) {
        const classItem = await this.classesService.create(createClassDto);
        return { hash: classItem.hash };
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.classesService.findAll(paginationQuery);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get(':classHash')
    findOne(@Param('classHash', ParseIntPipe) classHash: number) {
        const classItem = this.classesService.findOne(classHash);
        if (!classItem) {
            throw new NotFoundException(`Class #${classHash} not found`);
        }
        return classItem;
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Put(':classHash')
    update(@Param('classHash', ParseIntPipe) classHash: number, @Body() updateClassDto: UpdateClassDto) {
        return this.classesService.update(classHash, updateClassDto);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':classHash')
    @HttpCode(HttpStatus.GONE)
    async delete(@Param('classHash', ParseIntPipe) classHash: number) {
        await this.classesService.remove(classHash);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post(':classHash/lessons')
    async addLessonToClass(
        @Param('classHash', ParseIntPipe) classHash: number,
        @Body() classAddLesson: ClassAddLesson
    ) {
        try {
            await this.classesService.addLessonToClass(classHash, classAddLesson.lessonHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':classHash/lessons/:lessonHash')
    async deleteLessonFromClass(
        @Param('classHash', ParseIntPipe) classHash: number,
        @Param('lessonHash', ParseIntPipe) lessonHash: number
    ) {
        try {
            await this.classesService.deleteLessonFromClass(classHash, lessonHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post(':classHash/enroll')
    async studentEnroll(
        @Param('classHash', ParseIntPipe) classHash: number,
        @Body() studentEnroll: StudentEnroll
    ) {
        try {
            await this.classesService.enrollStudentToClass(classHash, studentEnroll.userHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post(':classHash/expel')
    async studentExpel(
        @Param('classHash', ParseIntPipe) classHash: number,
        @Body() studentExpel: StudentExpel
    ) {
        try {
            await this.classesService.expelStudentFromClass(classHash, studentExpel.userHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }
}

