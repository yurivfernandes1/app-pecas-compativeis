import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qznwiwyckreulucspsqj.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD';

export const supabase = createClient(supabaseUrl, supabaseKey);
