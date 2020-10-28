import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import {ApiCookieAuth, ApiForbiddenResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "./users.service";
import {Public} from "../common/decorators/public.decorator";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {ParseIntPipe} from "../common/pipes/parse-int.pipe";
import {UpdateUserDto} from "./dto/update-user.dto";

@ApiTags('Users by hash')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const userItem = await this.usersService.create(createUserDto);
        return { hash: userItem.hash };
    }

    @ApiCookieAuth()
    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.usersService.findAll(paginationQuery);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiCookieAuth()
    @Get(':userHash')
    findOne(@Param('userHash', ParseIntPipe) userHash: number) {
        const userItem = this.usersService.findOne(userHash);
        if (!userItem) {
            throw new NotFoundException(`User #${userHash} not found`);
        }
        return userItem;
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiCookieAuth()
    @Put(':userHash')
    update(@Param('userHash', ParseIntPipe) userHash: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(userHash, updateUserDto);
    }

    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiCookieAuth()
    @Delete(':userHash')
    async delete(@Param('userHash', ParseIntPipe) userHash: number) {
        await this.usersService.remove(userHash);
    }
}
