import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { LocalSignUpDTO } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepo.find();
    return users.map((user) => plainToInstance(User, user));
  }

  async getUserById(id: string) {
    return await this.usersRepo.findOneOrFail(id);
  }
  async getUsersTokenVersion(id: string) {
    return await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.tokenVersion')
      .where({
        id: id,
      })
      .getOne();
  }

  async getUserWithHashedPassword(email: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.tokenVersion')
      .where({
        email,
      })
      .getOne();
    if (!user) throw new ForbiddenException('access denied');
    return user;
  }

  async getUsedRefershTokens(id: string) {
    const { usedRefreshTokens, tokenVersion } = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.usedRefreshTokens')
      .addSelect('user.tokenVersion')
      .where({
        id,
      })
      .getOne();
    return { usedRefreshTokens, tokenVersion };
  }

  async getUserWithRefreshToken(id: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .where({
        id,
      })
      .getOne();
    if (!user) throw new ForbiddenException('access denied');
    return user;
  }

  async updateUser(id: string, payload: Partial<User>) {
    await this.usersRepo.update(id, payload);
    return await this.getUserById(id);
  }

  async createUser({
    firstName,
    lastName,
    password,
    username,
    email,
  }: LocalSignUpDTO) {
    const newUser = await this.usersRepo.create({
      firstName,
      lastName,
      password,
      email,
      username,
    });
    const { id } = await this.usersRepo.save(newUser);
    return await this.getUserById(id);
  }
}
