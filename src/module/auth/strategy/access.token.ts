import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { configService } from 'src/config/config.service';
import { UserService } from 'src/module/user/user.service';
import { JWTAccessPayloadDTO } from '../auth.dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token: string = req.cookies['accessToken'];
          return token;
        },
      ]),
      secretOrKey: configService.getAccessJWTSecret(),
    } as StrategyOptions);
  }

  async validate(payload: JWTAccessPayloadDTO) {
    return await this.userService.getUserById(payload.id);
  }
}
