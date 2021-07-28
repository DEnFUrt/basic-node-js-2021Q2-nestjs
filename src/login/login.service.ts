import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/utils-crypto/crypto.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {}

  async signToken(loginDto: LoginDto): Promise<{ token: string } | undefined> {
    const { login: reqLogin, password: reqPassword } = loginDto;

    const user = await this.userService.findOneByLogin(reqLogin);

    if (user === undefined) {
      return undefined;
    }

    const { id, login, password: hashedPassword } = user;

    const resultReconciling = await this.cryptoService.chechkPassword(reqPassword, hashedPassword);

    if (resultReconciling !== true) {
      return undefined;
    }

    const token = (await this.cryptoService.createToken({ id, login })) as string;

    return { token };
  }
}
