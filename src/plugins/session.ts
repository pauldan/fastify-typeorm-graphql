import fp from 'fastify-plugin';
import { FastifyPluginCallback, FastifyPluginOptions } from 'fastify';
import { FastifyInstance } from 'fastify';

import cookie from 'fastify-cookie';
import session, { SessionStore } from '@mgcrea/fastify-session';

import { RedisStore } from 'fastify-redis-session';
import Redis from 'ioredis';

export default fp<FastifyPluginCallback>(
  (
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error) => void,
  ) => {
    function getSessionStore(): SessionStore | undefined {
      if (fastify.config.SESSION_REDIS) {
        return new RedisStore({
          client: new Redis(fastify.config.SESSION_REDIS),
          ttl: fastify.config.SESSION_TTL,
        });
      }

      return undefined;
    }
    const { SESSION_SECRET, ENV } = fastify.config;
    const _PROD_ = ENV === 'production';
    fastify.register(cookie);
    fastify.register(session, {
      store: getSessionStore(),
      secret: SESSION_SECRET,
      saveUninitialized: false,
      prefix: 'dfewq',
      cookie: {
        maxAge: 2 * 60 * 60 * 24,
        httpOnly: true,
        secure: _PROD_,
      },
    });
    done();
  },
  { name: 'session', dependencies: ['config'] },
);
