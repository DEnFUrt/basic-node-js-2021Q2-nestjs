import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto/login.dto';
import { TokenResponse } from './common/types-swagger';
import { LocalAuthGuard } from './local-auth.guards';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiTags('login')
  @ApiBody({ description: 'The create token', type: LoginDto })
  @ApiResponse({ status: 200, description: 'Creates a new token', type: TokenResponse })
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
