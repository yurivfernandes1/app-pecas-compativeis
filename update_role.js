const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data: users, error: userError } = await supabase.from('mk3_users').select('*').eq('username', 'yurivf');
  console.log('mk3_users:', users);

  if (users && users.length > 0) {
    const userId = users[0].id;
    // We can't update directly with the anon key because of RLS on profiles, but let's try
    const { data: profileUpdate, error: updateError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
    console.log('Update Error:', updateError);
  }
}
main();
