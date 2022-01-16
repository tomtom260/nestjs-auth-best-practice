import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import { configService } from 'src/config/config.service';

import { UserService } from '../user/user.service';
import {
  LocalSignUpDTO,
  LocalAuthResposeDTO,
  LocalSignInDTO,
} from './auth.dto';
import { tokensType } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private JWTService: JwtService,
  ) {}
  private async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private getTokens(id: string, tokenVersion: number): tokensType {
    const accessToken = this.JWTService.sign(
      { id },
      {
        expiresIn: '5m',
        secret: configService.getAccessJWTSecret(),
      },
    );
    const refreshToken = this.JWTService.sign(
      { id, tokenVersion },
      {
        expiresIn: '60d',
        secret: configService.getRefreshJWTSecret(),
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateRefreshToken(id: string, token: string) {
    const { tokenVersion, usedRefreshTokens } =
      await this.userService.getUsedRefershTokens(id);
    if (usedRefreshTokens.includes(token)) {
      this.userService.updateUser(id, {
        tokenVersion: tokenVersion + 1,
      });
      throw new ForbiddenException();
    } else {
      usedRefreshTokens.push(token);
      return this.userService.updateUser(id, {
        usedRefreshTokens,
      });
    }
  }

  logout(res: Response) {
    const tokens: tokensType = {
      accessToken: null,
      refreshToken: null,
    };
    for (const key in tokens) {
      res.cookie(key, tokens[key], {
        maxAge: -1000 * 60 * 5,
        httpOnly: true,
        secure: configService.isProduction(),
      });
    }

    return {
      status: 'success',
      message: 'user logged out',
    };
  }

  private sendTokensasCookies(res: Response, tokens: tokensType) {
    for (const key in tokens) {
      res.cookie(key, tokens[key], {
        maxAge:
          key === 'accessToken' ? 1000 * 60 * 5 : 1000 * 60 * 60 * 24 * 60, // 5 min for access token 2 months for refresh token
        httpOnly: true,
        secure: configService.isProduction(),
      });
    }
  }

  async localSignIn(
    body: LocalSignInDTO,
    res: Response,
  ): Promise<LocalAuthResposeDTO> {
    const { tokenVersion, password, ...user } =
      await this.userService.getUserWithHashedPassword(body.email);
    if (!bcrypt.compareSync(body.password, password)) {
      throw new ForbiddenException('access denied');
    }

    const tokens = this.getTokens(user.id, tokenVersion);
    this.sendTokensasCookies(res, tokens);
    return {
      user,
    };
  }

  async localSignUp(
    body: LocalSignUpDTO,
    res: Response,
  ): Promise<LocalAuthResposeDTO> {
    body.password = await this.hashData(body.password);
    const user = await this.userService.createUser(body);
    const { tokenVersion } = await await this.userService.getUsersTokenVersion(
      user.id,
    );
    const tokens = this.getTokens(user.id, tokenVersion);
    this.sendTokensasCookies(res, tokens);
    return {
      user,
    };
  }

  async refreshTokens(req: Request, res: Response, id: string) {
    const { tokenVersion } = await this.userService.getUsersTokenVersion(id);
    const { refreshToken } = req.cookies;
    await this.validateRefreshToken(id, refreshToken);

    const tokens = this.getTokens(id, tokenVersion);
    this.sendTokensasCookies(res, tokens);
    return {
      status: 'success',
      message: 'tokens refreshed',
    };
  }
}
