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
import {CreateVideoDto} from "../videos/dto/create-video.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ParseIntPipe} from "../common/pipes/parse-int.pipe";
import {UpdateVideoDto} from "../videos/dto/update-video.dto";
import {throwError} from "rxjs";
import {KeynotesService} from "./keynotes.service";

@ApiTags('Keynotes')
@Controller('keynotes')
export class KeynotesController {
    constructor(private readonly keynotesService: KeynotesService) {}

    @Post()
    async create(@Body() createVideoDto: CreateVideoDto) {
        const keynoteItem = await this.keynotesService.create(createVideoDto);
        return { hash: keynoteItem.hash };
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.keynotesService.findAll(paginationQuery);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get(':keynoteHash')
    findOne(@Param('keynoteHash', ParseIntPipe) keynoteHash: number) {
        const keynoteItem = this.keynotesService.findOne(keynoteHash);
        if (!keynoteItem) {
            throw new NotFoundException(`Class #${keynoteHash} not found`);
        }
        return keynoteItem;
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Put(':keynoteHash')
    update(@Param('keynoteHash', ParseIntPipe) keynoteHash: number, @Body() updateVideoDto: UpdateVideoDto) {
        return this.keynotesService.update(keynoteHash, updateVideoDto);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':keynoteHash')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('keynoteHash', ParseIntPipe) keynoteHash: number) {
        try {
            await this.keynotesService.remove(keynoteHash);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return throwError(new BadRequestException(err.message));
            }
            return throwError(err);
        }
    }
}
