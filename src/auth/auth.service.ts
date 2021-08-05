import { Injectable } from '@nestjs/common';
import { CryptoService } from 'src/utils-crypto/crypto.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private readonly cryptoService: CryptoService) {}

  async validateUser(reqLogin: string, reqPassword: string): Promise<any> {
    const user = await this.usersService.findOneByLogin(reqLogin);

    if (user === undefined) {
      return undefined;
    }

    const { password: hashedPassword, ...result } = user;

    const resultReconciling = await this.cryptoService.chechkPassword(reqPassword, hashedPassword);

    if (resultReconciling !== true) {
      return undefined;
    }

    return result;
  }

  async login(user: any): Promise<{ token: string | void }> {
    const payload = { id: user.id, login: user.login };

    return {
      token: await this.cryptoService.createToken(payload),
    };
  }
}
