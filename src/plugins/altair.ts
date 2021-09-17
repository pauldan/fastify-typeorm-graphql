import fp from 'fastify-plugin';
import { FastifyPluginCallback, FastifyPluginOptions } from 'fastify';
import { FastifyInstance } from 'fastify';

import AltairFastify from 'altair-fastify-plugin';

module.exports = fp<FastifyPluginCallback>(
  (
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error) => void,
  ) => {
    // dont register altair in production
    if (fastify.config.ENV !== 'production') {
      fastify.register(AltairFastify, {
        path: '/altair',
        baseURL: '/altair',
        endpointURL: '/api/graphql',
      });
    }
    done();
  },
  { name: 'altair', dependencies: ['config', 'mercurius'] },
);
