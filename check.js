const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data: users, error: err1 } = await supabase
    .from('mk3_users')
    .select('id, username, is_premium');
  console.log('Current users:', users);

  const { data, error } = await supabase
    .from('mk3_users')
    .update({ is_premium: false, stripe_customer_id: null })
    .eq('username', 'yurivf')
    .select(); // Important: use .select() to see what was updated
    
  console.log('Update result:', data, 'Error:', error);
}
main();
