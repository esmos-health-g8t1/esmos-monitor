import pino from 'pino';
import { env } from 'server/env';

const transport = pino.transport({
  targets: [
    {
      target: '@logtail/pino',
      options: {
        sourceToken: env.BETTER_STACK_LOGS_TOKEN,
        options: { endpoint: env.BETTER_STACK_LOGS_DSN },
      },
      level: 'info',
    },
    {
      target: 'pino-pretty',
      options: {
        colorize: env.NODE_ENV === 'development',
      },
      level: 'info',
    },
  ],
});

const logger = pino(transport);

export default logger;
