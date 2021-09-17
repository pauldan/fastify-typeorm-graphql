import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import fp from 'fastify-plugin';

export default fp<FastifyPluginAsync>(
  async (fastify: FastifyInstance) => {
    const connection = await createConnection();
    fastify
      .decorate('orm', connection)
      .addHook('onClose', async (instance, done) => {
        await instance.orm.close();
        done();
      });
  },
  { name: 'database', dependencies: ['config'] },
);

declare module 'fastify' {
  export interface FastifyInstance {
    orm: Connection;
  }
}
