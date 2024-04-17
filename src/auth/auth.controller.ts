import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCredentialDto } from './dto/signin-user.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('signup')
  async signup(@Body() userObj: CreateUserDto) {
    return this.authService.signup(userObj);
  }

  @Public()
  @Post('signin')
  signin(@Body() userObj: UserCredentialDto) {
    return this.authService.signin(userObj);
  }
}
