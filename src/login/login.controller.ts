import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async create(@Body() loginDto: LoginDto) {
    const { login, password } = loginDto;

    const result = await this.loginService.signToken({ login, password });

    if (result === undefined) {
      throw new ForbiddenException(`Incorrect login or password`);
    }

    return result;
  }
}
