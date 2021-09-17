import fp from 'fastify-plugin';
import fastifyEnv from 'fastify-env';
import {
  FastifyPluginAsync,
  FastifyInstance,
  FastifyPluginOptions,
} from 'fastify';

type EnvSchema = {
  type: 'object';
  required?: string[];
  properties: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean';
      default?: number | string | boolean;
    };
  };
};

type EnvOptions = {
  confKey: string;
  schema: EnvSchema;
  dotenv?: boolean;
};

const schema: EnvSchema = {
  type: 'object',
  properties: {
    PG_HOST: {
      type: 'string',
    },
    PG_USER: {
      type: 'string',
    },
    PG_PASSWD: {
      type: 'string',
    },
    PG_DATABASE: {
      type: 'string',
    },
    PG_PORT: {
      type: 'number',
      default: 5432,
    },
    ENV: {
      type: 'string',
      default: '',
    },
    SESSION_SECRET: {
      type: 'string',
      default: 'must add a proper secret in production',
    },
    SESSION_REDIS: {
      type: 'string',
    },
    SESSION_TTL: {
      type: 'number',
      default: 42000,
    },
  },
};

const options: EnvOptions = {
  confKey: 'config',
  schema,
  dotenv: true,
};

export default fp<FastifyPluginAsync>(
  async (
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: (err?: Error) => void,
  ) => {
    fastify.register(fastifyEnv, options);
    done();
  },
  { name: 'config' },
);

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      PG_HOST: string;
      PG_USER: string;
      PG_PASSWD: string;
      PG_DATABASE: string;
      PG_PORT: number;
      ENV: string;
      SESSION_SECRET: string;
      SESSION_REDIS: string;
      SESSION_TTL: number;
    };
  }
}
