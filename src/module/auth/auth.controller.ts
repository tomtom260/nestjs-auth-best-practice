import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from 'src/entity/user.entity';
import {
  LocalSignUpDTO,
  LocalAuthResposeDTO,
  LocalSignInDTO,
  RefreshTokensResponseDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  async localSignIn(
    @Body() body: LocalSignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.localSignIn(body, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/local/signup')
  async localSignUp(
    @Body() body: LocalSignUpDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LocalAuthResposeDTO> {
    return await this.authService.localSignUp(body, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response): RefreshTokensResponseDTO {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request & { user: User & { refreshToken: string } },
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshTokensResponseDTO> {
    return await this.authService.refreshTokens(req, res, req.user.id);
  }
}
