import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
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
    const { login, password } = loginDto;

    return this.loginService.signToken({ login, password });
  }

  /* 
  // import { schemas } from 'src/utils/joi-schemas';
  // import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';

    (new JoiValidationPipe(schemas['auth']))
  }
  */
}
