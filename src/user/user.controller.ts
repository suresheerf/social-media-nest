import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getUser(@Req() request) {
    return this.userService.getUser(request.user._id);
  }

  @HttpCode(200)
  @Post('follow/:id')
  follow(@Param('id') userId: string, @Req() request) {
    return this.userService.follow(request.user._id, userId);
  }
  @HttpCode(200)
  @Post('unfollow/:id')
  unfollow(@Param('id') userId: string, @Req() request) {
    return this.userService.unfollow(request.user._id, userId);
  }

  @HttpCode(200)
  @Delete()
  delete(@Req() request) {
    return this.userService.delete(request.user);
  }
}
