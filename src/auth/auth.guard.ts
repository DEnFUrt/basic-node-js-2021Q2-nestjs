import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from 'src/utils-crypto/crypto.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ROUTE_WHITELIST = this.configService.get('ROUTE_WHITELIST') as string;
    const USE_FASTIFY = this.configService.get('USE_FASTIFY') === 'true' ? true : false;

    const req = context.switchToHttp().getRequest();
    const routPath = USE_FASTIFY ? req.routerPath : req.path;
    const result = ROUTE_WHITELIST.includes(routPath);

    const authHeader = req.headers.authorization;

    if (!result) {
      return this.cryptoService.verifyToken(authHeader);
    }
    return true;
  }
}
