import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createOne(createUser: CreateUserDto) {
    const user = new this.userModel(createUser);
    return user.save();
  }
  async getOne(email: string) {
    const user = await this.userModel.findOne({ email }).select('password');
    return user;
  }
  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }
  async follow(userId, idToFollow) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { following: idToFollow },
    });
    const other_user = await this.userModel.findByIdAndUpdate(idToFollow, {
      $addToSet: { followers: userId },
    });
    if (!other_user || !user) {
      throw new InternalServerErrorException();
    }

    return { status: 'success', message: 'Following user successfully' };
  }
  async unfollow(userId, idToFollow) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      $pull: { following: idToFollow },
    });
    const other_user = await this.userModel.findByIdAndUpdate(idToFollow, {
      $pull: { followers: userId },
    });
    if (!other_user || !user) {
      throw new InternalServerErrorException();
    }

    return { status: 'success', message: 'Unfollowing user successfully' };
  }
  async delete(user) {
    await this.userModel.updateMany(
      { _id: { $in: user.followers } },
      {
        $pull: { following: user._id },
      },
    );

    await this.userModel.updateMany(
      { _id: { $in: user.following } },
      {
        $pull: { followers: user._id },
      },
    );
    // await Post.deleteMany({ userId: req.user._id });
    await this.userModel.deleteOne({ _id: user._id });
    return { message: 'your account has been deleted successfully' };
  }
}
