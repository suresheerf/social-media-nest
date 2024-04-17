import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { Comment } from './comment.schema';
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private postService: PostService,
    
  ) {}

  async createOne(commentObj) {
    const comment = await this.commentModel.create(commentObj);

    await this.postService.pushComments(comment._id, commentObj.postId);
    return {
      commentId: comment._id,
    };
  }
}
