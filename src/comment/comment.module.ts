import { Module } from '@nestjs/common';

import { CommentController } from './comment.controller';

import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './comment.schema';
import { PostService } from 'src/post/post.service';
import { Post, PostSchema } from 'src/post/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [CommentController],

  providers: [CommentService, PostService],
})
export class CommentModule {}
