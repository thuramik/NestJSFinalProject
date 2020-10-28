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
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {ApiCookieAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ParseIntPipe} from "../common/pipes/parse-int.pipe";
import {throwError} from "rxjs";
import {LessonsService} from "./lessons.service";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";
import {LessonsAddVideo} from "./dto/lesson-add-video.dto";
import {LessonsAddKeynote} from "./dto/lesson-add-keynote.dto";

@ApiTags('Lessons')
@ApiCookieAuth()
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Post()
    async create(@Body() createLessonDto: CreateLessonDto) {
        const lessonItem = await this.lessonsService.create(createLessonDto);
        return { hash: lessonItem.hash };
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.lessonsService.findAll(paginationQuery);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get(':lessonHash')
    findOne(@Param('lessonHash', ParseIntPipe) lessonHash: number) {
        const lessonItem = this.lessonsService.findOne(lessonHash);
        if (!lessonItem) {
            throw new NotFoundException(`Class #${lessonHash} not found`);
        }
        return lessonItem;
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Put(':lessonHash')
    update(@Param('lessonHash', ParseIntPipe) lessonHash: number, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(lessonHash, updateLessonDto);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':lessonHash')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('lessonHash', ParseIntPipe) lessonHash: number) {
        try {
            await this.lessonsService.remove(lessonHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post(':lessonHash/videos')
    @HttpCode(HttpStatus.NO_CONTENT)
    async addVideoToLesson(
        @Param('lessonHash', ParseIntPipe) lessonHash: number,
        @Body() lessonsAddVideo: LessonsAddVideo
    ) {
        try {
            await this.lessonsService.addVideoToLesson(lessonHash, lessonsAddVideo.videoHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get(':lessonHash/videos/:videoHash')
    async getVideoOfLesson(
        @Param('lessonHash', ParseIntPipe) lessonHash: number,
        @Param('videoHash', ParseIntPipe) videoHash: number
    ) {
        try {
            return this.lessonsService.getVideoOfLesson(lessonHash, videoHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':lessonHash/videos/:videoHash')
    async deleteVideoFromLesson(
        @Param('lessonHash', ParseIntPipe) lessonHash: number,
        @Param('videoHash', ParseIntPipe) videoHash: number
    ) {
        try {
            await this.lessonsService.deleteVideoFromLesson(lessonHash, videoHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post(':lessonHash/keynotes')
    @HttpCode(HttpStatus.NO_CONTENT)
    async addKeynoteToLesson(
        @Param('lessonHash', ParseIntPipe) lessonHash: number,
        @Body() lessonsAddKeynote: LessonsAddKeynote
    ) {
        try {
            await this.lessonsService.addKeynoteToLesson(lessonHash, lessonsAddKeynote.keynoteHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get(':lessonHash/keynotes/:keynoteHash')
    async getKeynoteOfLesson(
        @Param('lessonHash', ParseIntPipe) lessonHash: number,
        @Param('keynoteHash', ParseIntPipe) keynoteHash: number
    ) {
        try {
            return this.lessonsService.getKeynoteOfLesson(lessonHash, keynoteHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':lessonHash/keynotes/:keynoteHash')
    async deleteKeynoteFromLesson(
        @Param('lessonHash', ParseIntPipe) lessonHash: number,
        @Param('keynoteHash', ParseIntPipe) keynoteHash: number
    ) {
        try {
            await this.lessonsService.deleteKeynoteFromLesson(lessonHash, keynoteHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }
}
