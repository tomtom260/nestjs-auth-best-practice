import { Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(AuthGuard('jwt-access'))
  @UsePipes(new ValidationPipe({ transform: true }))
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getUserByID(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // createUser(@Body() body: CreateUserDTO) {
  //   return this.userService.createUser(
  //     body.firstName,
  //     body.lastName,
  //     body.isActive,
  //   );
  // }
}
