import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { AuthGuard } from '../middleware/AuthGuard';
import { Context } from '../types';
import { PostCreateInput } from './types/Post';

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  async creator(@Root() post: Post): Promise<User | undefined> {
    return await User.findOne(post.creatorId);
  }

  @UseMiddleware(AuthGuard)
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find();
  }

  @UseMiddleware(AuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Arg('data', () => PostCreateInput) data: PostCreateInput,
    @Ctx() ctx: Context,
  ): Promise<Post> {
    const userId = ctx.userId;
    const post = await Post.create({
      ...data,
      creatorId: userId,
    }).save();

    return post;
  }

  @UseMiddleware(AuthGuard)
  @Mutation(() => Int, { nullable: true })
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { userId, isAdmin }: Context,
  ): Promise<number | null> {
    const criteria: { id: number; creatorId?: number } = { id };

    if (!isAdmin) {
      criteria.creatorId = userId;
    }

    const res = await Post.delete({ id, creatorId: userId });

    if (res?.affected && res.affected > 0) {
      return id;
    }

    return null;
  }
}
