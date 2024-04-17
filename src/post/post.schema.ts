import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Comment } from 'src/comment/comment.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: [true, 'Post must belong to a user'],
  })
  userId: User;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likes: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  unlikes: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
    default: [],
  })
  comments: Comment;
}

export const PostSchema = SchemaFactory.createForClass(Post);
