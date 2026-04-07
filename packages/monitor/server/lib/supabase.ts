import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

const supabaseUrl = env.SUPABASE_URL;
const secretKey = env.SUPABASE_SECRET_KEY;

export const supabase = createClient(supabaseUrl, secretKey);
