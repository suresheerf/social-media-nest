import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from './post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getPosts(userId) {
    const posts = await this.postModel.find({ userId: userId });
    return { status: 'success', posts };
  }

  async getFeed() {
    const posts = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'comments',
        },
      },
      {
        $addFields: {
          desc: '$description',
          likes: { $size: '$likes' },
          created_at: '$createdAt',
          id: '$_id',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          id: 1,
          title: 1,
          desc: 1,
          created_at: 1,
          comments: 1,
          likes: 1,
        },
      },
    ]);
    return { status: 'success', posts };
  }

  async create(postObj) {
    const post = await this.postModel.create(postObj);

    return post;
  }

  async getOne(postId) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('could not find the post');
    return post;
  }

  async deleteOne(postId, userId) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('could not find the post');

    if (post.userId?.toString() !== userId.toString()) {
      throw new UnauthorizedException('this post does not belong to you');
    }
    await this.postModel.findByIdAndDelete(postId);

    return { status: 'success', message: 'Post deleted successfully' };
  }

  async like(postId, user) {
    const post = await this.postModel.findByIdAndUpdate(postId, {
      $addToSet: { likes: user._id },
      $pull: { unlikes: user._id },
    });
    if (!post) throw new NotFoundException('post not found');
    return { status: 'success', message: 'Post liked successfully' };
  }
  async unlike(postId, user) {
    const post = await this.postModel.findByIdAndUpdate(postId, {
      $addToSet: { unlikes: user._id },
      $pull: { likes: user._id },
    });
    if (!post) throw new NotFoundException('post not found');
    return { status: 'success', message: 'Post liked successfully' };
  }

  async pushComments(commentId, postId) {
    await this.postModel.updateOne(
      { _id: postId },
      { $push: { comments: commentId } },
    );
  }
}
