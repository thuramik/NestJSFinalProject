import {Controller, Post, Headers, Request, Res, HttpStatus, BadRequestException} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Public} from "../common/decorators/public.decorator";
import {ApiCookieAuth, ApiTags} from "@nestjs/swagger";
import {USER_SESSION_ID} from "./constants";

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('/login')
    async login(@Headers('authorization') authorization: string, @Request() req, @Res() response) {
        const user = Buffer.from(authorization.substr(5), 'base64').toString('utf8')
        const [email, password] = user.split(':');
        const userItem = await this.authService.validateUser(email, password);
        if (null !== userItem) {
            response.cookie(USER_SESSION_ID, process.env.API_KEY);
        } else {
            throw new BadRequestException(`incorrect payload`);
        }

        response.status(HttpStatus.NO_CONTENT).send();
    }

    @ApiCookieAuth()
    @Post('/logout')
    async logout(@Res() response) {
        response.clearCookie(USER_SESSION_ID);
        response.status(HttpStatus.NO_CONTENT).json({ message: 'logged out!' });
    }
}
