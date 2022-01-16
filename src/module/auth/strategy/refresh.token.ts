import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { configService } from 'src/config/config.service';
import { UserService } from 'src/module/user/user.service';
import { JWTRefreshPayloadDTO } from '../auth.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userService: UserService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token: string = req.cookies['refreshToken'];
          return token;
        },
      ]),
      secretOrKey: configService.getRefreshJWTSecret(),
    } as StrategyOptions);
  }

  async validate(req: Request, payload: JWTRefreshPayloadDTO) {
    const { tokenVersion, ...user } =
      await this.userService.getUsersTokenVersion(payload.id);
    if (tokenVersion !== payload.tokenVersion) throw new ForbiddenException();
    return user;
  }
}
