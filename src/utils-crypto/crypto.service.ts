import {
  Global,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { verify, sign, Secret, SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';

type AuthUser = { id: string; login: string };

const jwtVerify = promisify<string, Secret>(verify);
const jwtSign = promisify<AuthUser, Secret, SignOptions>(sign);

@Global()
@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  SOLT_ROUNDS = this.configService.get('SOLT_ROUNDS');
  JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY') as Secret;
  EXPIRES_IN = this.configService.get('EXPIRES_IN');

  public hashByPassword = async (password: string | Buffer): Promise<string> => {
    const result = await bcrypt.hash(password, parseInt(this.SOLT_ROUNDS, 10));

    return result;
  };

  public chechkPassword = async (password: string | Buffer, hash: string): Promise<boolean> => {
    const result = await bcrypt.compare(password, hash);

    return result;
  };

  public verifyToken = async (authHeader: string): Promise<boolean> => {
    try {
      if (authHeader === undefined) {
        throw Error();
      }

      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || token === undefined) {
        throw Error();
      }

      await jwtVerify(token, this.JWT_SECRET_KEY);

      return true;
    } catch {
      throw new UnauthorizedException('Wrong auth schemas!');
    }
  };

  public createToken = async ({ id, login }: AuthUser): Promise<void | string> => {
    try {
      return await jwtSign({ id, login }, this.JWT_SECRET_KEY as Secret, {
        expiresIn: this.EXPIRES_IN,
      });
    } catch (e) {
      throw new InternalServerErrorException((e as Error).message);
    }
  };
}
