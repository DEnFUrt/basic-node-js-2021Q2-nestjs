import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { CryptoService } from 'src/utils-crypto/crypto.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, CryptoService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
