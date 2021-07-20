import { Body, Controller, ForbiddenException, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async create(@Body() loginDto: LoginDto, @Res() res: Response | FastifyReply) {
    const { login, password } = loginDto;

    const result = await this.loginService.signToken({ login, password });

    if (result === undefined) {
      throw new ForbiddenException(`Incorrect login or password`);
    }

    res.send(result);
  }
}
