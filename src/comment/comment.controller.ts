import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':postId')
  createComment(@Param('postId') postId, @Body() commentObj, @Req() request) {
    const payload = {
      userId: request.user._id,
      postId,
      content: commentObj.content,
    };
    return this.commentService.createOne(payload);
  }
}
