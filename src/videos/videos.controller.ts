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
import {VideosService} from "./videos.service";
import {CreateVideoDto} from "./dto/create-video.dto";
import {UpdateVideoDto} from "./dto/update-video.dto";
import {throwError} from "rxjs";

@ApiTags('Videos')
@ApiCookieAuth()
@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Post()
    async create(@Body() createVideoDto: CreateVideoDto) {
        const videoItem = await this.videosService.create(createVideoDto);
        return { hash: videoItem.hash };
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.videosService.findAll(paginationQuery);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get(':videoHash')
    findOne(@Param('videoHash', ParseIntPipe) videoHash: number) {
        const videoItem = this.videosService.findOne(videoHash);
        if (!videoItem) {
            throw new NotFoundException(`Class #${videoHash} not found`);
        }
        return videoItem;
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Put(':videoHash')
    update(@Param('videoHash', ParseIntPipe) videoHash: number, @Body() updateVideoDto: UpdateVideoDto) {
        return this.videosService.update(videoHash, updateVideoDto);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':videoHash')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('videoHash', ParseIntPipe) videoHash: number) {
        try {
            await this.videosService.remove(videoHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }
}
