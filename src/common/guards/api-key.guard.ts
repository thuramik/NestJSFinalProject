import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {USER_SESSION_ID} from "../../auth/constants";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
      private readonly reflector: Reflector,
      private readonly configService: ConfigService,
  ) {}

  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    return request.cookies[USER_SESSION_ID] !== undefined && request.cookies[USER_SESSION_ID] === this.configService.get('API_KEY');
  }
}