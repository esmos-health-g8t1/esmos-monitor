import { supabase } from 'server/lib/supabase';
import logger from 'server/lib/pino';
import initSentry from 'server/lib/sentry';

/**
 * Uploads a screenshot to Supabase Storage.
 * @param screenshotBuffer - The screenshot buffer to upload.
 * @param testTitle - The title of the test.
 */
export default async function uploadScreenshot(
  screenshotBuffer: Buffer,
  testTitle: string,
): Promise<void> {
  const sanitizedTitle = testTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = `failures/${new Date().toISOString().toLocaleString()}_${sanitizedTitle}.png`;
  const Sentry = initSentry();

  const { error } = await supabase.storage
    .from('test-failures')
    .upload(filePath, screenshotBuffer, {
      contentType: 'image/png',
      upsert: false,
    });

  if (error) {
    logger.error(error, 'Supabase Storage error');
    Sentry.captureException(error);
  }

  const { data: publicUrlData } = supabase.storage
    .from('test-failures')
    .getPublicUrl(filePath);

  logger.info(
    `new screenshot of test failure uploaded to: ${publicUrlData.publicUrl}`,
  );
}
