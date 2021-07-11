import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
// import { schemas } from 'src/utils/joi-schemas';
// import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() loginDto: LoginDto) {
    // const NODE_ENV = this.configService.get('NODE_ENV');
    const { login, password } = loginDto;

    return this.loginService.signToken({ login, password });
  }
  /* 
    if (NODE_ENV === 'production') {
  (new JoiValidationPipe(schemas['auth']))
    }
   */
}
