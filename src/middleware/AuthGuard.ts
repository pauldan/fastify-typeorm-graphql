import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types';

export const AuthGuard: MiddlewareFn<Context> = async (
  { context: { session } },
  next,
) => {
  const userId = session.get('userId');

  if (!userId) {
    throw new GraphQLError('Forbidded. Unauthenticated.');
  }

  return next();
};
