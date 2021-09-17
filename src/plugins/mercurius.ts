import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify';
import mercurius from 'mercurius';
import { buildSchema } from 'type-graphql';

import { UserResolver } from '../resolvers/UserResolver';
import { loaders } from '../utils/loaders';
import { PostResolver } from '../resolvers/PostResolver';
import { Context } from '../types';

export default fp<FastifyPluginAsync>(
  async function (fastify: FastifyInstance) {
    fastify.register(mercurius, {
      path: '/api/graphql',
      schema: await buildSchema({
        resolvers: [UserResolver, PostResolver],
        dateScalarMode: 'isoDate',
      }),
      loaders: {
        ...loaders,
      },
      graphiql: false,
      jit: 1,
      context: (request: FastifyRequest): Context => {
        const context: Context = {
          session: request.session,
        };

        const userId = request.session.get('userId');
        const isAdmin = request.session.get('isAdmin');

        if (typeof userId === 'number') {
          context.userId = userId;
        }

        if (typeof isAdmin === 'boolean') {
          context.isAdmin = isAdmin;
        }

        return context;
      },
    });
  },
  {
    name: 'mercurius',
    dependencies: ['config', 'session'],
  },
);
