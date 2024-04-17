import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(userObj) {
    const isEmailTaken = await this.userService.getOne(userObj.email);
    if (isEmailTaken) throw new BadRequestException('Email already taken');
    const hashedPassword = await this.generateHash(userObj.password);
    const user = await this.userService.createOne({
      ...userObj,
      password: hashedPassword,
    });
    const token = await this.jwtService.signAsync({ _id: user._id });
    user.password = undefined;
    return { token, user };
  }
  async signin(credentials) {
    const user = await this.userService.getOne(credentials.email);
    if (!user)
      throw new NotFoundException('could not find the user with given email');

    const isCorrect = this.isPasswordCorrect(
      credentials.password,
      user.password,
    );
    if (!isCorrect)
      throw new BadRequestException('Please enter correct password');

    const token = await this.jwtService.signAsync({ _id: user._id });
    return { token };
  }
  async generateHash(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async isPasswordCorrect(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
