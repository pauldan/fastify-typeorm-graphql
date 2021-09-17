import { MercuriusLoaders } from 'mercurius';
import { In } from 'typeorm';
import { Post } from '../entity/Post';
import { User } from '../entity/User';

export const loaders: MercuriusLoaders = {
  User: {
    async posts(queries) {
      const userIds = queries.map(({ obj }) => obj.id);

      const posts = await Post.find({
        where: {
          creatorId: In(userIds),
        },
      });

      const postByUserId: Record<number, Post[]> = {};

      posts.forEach(post => {
        if (!postByUserId[post.creatorId]) {
          postByUserId[post.creatorId] = [post];
        } else {
          postByUserId[post.creatorId].push(post);
        }
      });

      return queries.map(({ obj }) => postByUserId[obj.id] || []); // return empty array if none are found.
    },
  },
  Post: {
    async creator(queries) {
      // get unique userIds
      const userIds = Array.from(
        new Set<number>(queries.map(({ obj }) => obj.creatorId)),
      );

      const users = await User.findByIds(userIds);

      const userToUserId: Record<number, User> = {};

      users.forEach(user => {
        userToUserId[user.id] = user;
      });

      return queries.map(({ obj }) => userToUserId[obj.creatorId]);
    },
  },
};
