import type { TestInfo } from '@playwright/test';
import logger from '../lib/pino';
import initSentry from 'server/lib/sentry';
import uploadScreenshot from './upload-screenshot';
import ansiRegex from 'ansi-regex';
/**
 * Logs to Better Stack Logs, reports error to Better Stack Errors and uploads screenshot to Supabase Storage.
 * @param testInfo - The test information.
 * @param screenshotBuffer - The screenshot buffer.
 * @param explicitError - The explicit error.
 */
export default async function logAndReportError(
  testInfo: TestInfo,
  screenshotBuffer: Buffer,
  explicitError?: Error,
): Promise<void> {
  const Sentry = initSentry();

  if (testInfo.status !== 'passed' || explicitError) {
    const error = explicitError || testInfo.error;
    const errorMessage = `Test failed: ${testInfo.title}`;

    logger.error(errorMessage);
    if (error) {
      logger.error(error.message?.replace(ansiRegex(), ''), `Error Message`);
      logger.error(error.stack?.replace(ansiRegex(), ''), `Error Stack`);
    }

    Sentry.captureException(error, {
      extra: {
        testInfo: {
          title: testInfo.title,
          status: testInfo.status,
          duration: testInfo.duration,
          retry: testInfo.retry,
          annotations: testInfo.annotations,
        },
      },
    });

    // upload the screenshot to supabase
    await uploadScreenshot(screenshotBuffer, testInfo.title);
  }
}
