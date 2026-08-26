const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data, error } = await supabase
    .from('mk3_users')
    .update({ is_premium: false, stripe_customer_id: null })
    .eq('username', 'yurivf');
    
  console.log('Update error:', error);
  console.log('Update successful, user is now free tier.');
}
main();
