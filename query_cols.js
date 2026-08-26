const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'mk3_posts' });
  console.log('Error:', error);
}
main();
