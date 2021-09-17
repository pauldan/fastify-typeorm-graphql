import { Session } from '@mgcrea/fastify-session';

export type Context = {
  session: Session;
  userId?: number;
  isAdmin?: boolean;
};
