import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { CryptoService } from 'src/utils-crypto/crypto.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [UsersModule],
  controllers: [LoginController],
  providers: [LoginService, CryptoService],
})
export class LoginModule {}
