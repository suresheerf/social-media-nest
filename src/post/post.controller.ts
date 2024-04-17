import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Get()
  getPosts(@Req() request) {
    return this.postService.getPosts(request.user._id);
  }

  @Get('feed')
  getFeed() {
    return this.postService.getFeed();
  }

  @Post()
  createPost(@Body() postObj, @Req() request) {
    const createPost = {
      title: postObj.title,
      description: postObj.description,
      userId: request.user._id,
    };
    return this.postService.create(createPost);
  }

  @Get(':postId')
  getOne(@Param('postId') postId) {
    return this.postService.getOne(postId);
  }

  @HttpCode(200)
  @Delete(':postId')
  deleteOne(@Param('postId') postId, @Req() request) {
    return this.postService.deleteOne(postId, request.user._id);
  }

  @HttpCode(200)
  @Post('like/:postId')
  likePost(@Param('postId') postId, @Req() request) {
    return this.postService.like(postId, request.user._id);
  }
  @HttpCode(200)
  @Post('unlike/:postId')
  unlikePost(@Param('postId') postId, @Req() request) {
    return this.postService.unlike(postId, request.user._id);
  }
}
