import * as bcrypt from 'bcryptjs';
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

import { User } from '../entity/User';
import { Context } from '../types';
import { AuthGuard } from '../middleware/AuthGuard';
import { UserInput, UserRegisterInput } from './types/User';
import { GraphQLError } from 'graphql';
import { Post } from '../entity/Post';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => [Post])
  async posts(@Root() user: User): Promise<Post[]> {
    console.log(user);
    const posts = await Post.find({
      where: {
        creatorId: user.id,
      },
    });

    return posts || [];
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data', () => UserInput!) data: UserInput,
  ): Promise<User> {
    const { password, ...inputData } = data;
    const salt = Date.now().toString();
    const hashSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(salt + password, hashSalt);
    const user = await User.create({
      ...inputData,
      salt,
      password: hashedPassword,
    }).save();

    return user;
  }

  @Mutation(() => User)
  async registerUser(
    @Arg('data', () => UserRegisterInput) data: UserRegisterInput,
  ): Promise<User> {
    const { password, confirmPassword, ...rest } = data;

    if (password !== confirmPassword) {
      throw new GraphQLError('The passwords do not match.');
    }

    if (password === '') {
      throw new GraphQLError('The password cannot be empty.');
    }

    const salt = Date.now().toString();
    const hashSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(salt + password, hashSalt);
    const user = await User.create({
      ...rest,
      salt,
      password: hashedPassword,
    }).save();

    return user;
  }

  @Mutation(() => User)
  async authenticateUser(
    @Arg('username', () => String!) username: string,
    @Arg('password', () => String!) password: string,
    @Ctx() ctx: Context,
  ): Promise<User | null> {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user || !password) {
      return null;
    }

    if (!bcrypt.compareSync(user.salt + password, user.password)) {
      return null;
    }

    const { session } = ctx;
    session.set('userId', user.id);
    session.set('userIsAdmin', user.isAdmin);

    return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthGuard)
  logout(@Ctx() context: Context): boolean {
    const { session } = context;
    session.destroy();

    return true;
  }

  @Query(() => User)
  @UseMiddleware(AuthGuard)
  async me(@Ctx() ctx: Context): Promise<User | undefined> {
    const currentUserId = ctx.session.get('userId');
    const user = await User.findOne({
      where: {
        id: currentUserId,
      },
    });

    return user;
  }

  @Query(() => User)
  @UseMiddleware(AuthGuard)
  async user(@Arg('id', () => Int) id: number): Promise<User | undefined> {
    return await User.findOne(id);
  }
}
