const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data, error } = await supabase.from('profiles').select('role').eq('id', '60cb3946-9966-4571-81e2-8b6ac3c202bd').single();
  console.log('Role:', data);
  console.log('Error:', error);
}
main();
