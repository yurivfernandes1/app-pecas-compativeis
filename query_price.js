const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data, error } = await supabase.from('mk3_settings').select('premium_price').limit(1).single();
  console.log('Price data:', data);
  console.log('Error:', error);
}
main();
