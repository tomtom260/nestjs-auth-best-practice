import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { RefreshTokenStrategy } from './strategy/refresh.token';
import { AccessTokenStrategy } from './strategy/access.token';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
