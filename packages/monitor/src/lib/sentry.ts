import * as Sentry from '@sentry/node';
import { env } from '../env';

/**
 * Initializes Sentry if not already initialized.
 */
export default function initSentry(): typeof Sentry {
  if (!Sentry.isInitialized()) {
    Sentry.init({
      dsn: env.BETTER_STACK_ERROR_DSN,
      tracesSampleRate: 1.0,
      release: 'esmos-monitor@1.0.0',
    });
  }

  return Sentry;
}
