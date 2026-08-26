const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qznwiwyckreulucspsqj.supabase.co', 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD');

async function main() {
  const { data, error } = await supabase.from('mk3_posts').insert({
    user_id: 'be20bde3-0f62-486c-8f59-11b02d8a6f47', // yurivfernandes1
    texto: 'Test texto',
    content: 'Test content'
  });
  console.log('Error:', error);
}
main();
