const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data, error } = await supabase
    .from('mk3_garagem')
    .select('*, user:mk3_users(username, nome_completo, avatar_url)');
  
  console.log('Cars:', data?.length || 0);
  console.log('Error:', error);
}
main();
