const { createClient } = require('@supabase/supabase-js');

// Configs - substitua pelas do projeto real se necessário, mas vou tentar pegar do env se tiver, se não hardcode do que eu conheço.
const SUPABASE_URL = 'https://qznwiwyckreulucspsqj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Sxu_V9sq4gPFA4CIIIYE-w_WNl_DLUD';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categoryNames = [
  "Exterior",
  "Interior",
  "Performance",
  "Colecionáveis",
  "Acessórios",
  "Manutenção"
];

async function run() {
  console.log('1. Criando Categorias...');
  for (const name of categoryNames) {
    const { data: existing } = await supabase.from('pecas_categorias').select('*').eq('nome', name).single();
    if (!existing) {
      await supabase.from('pecas_categorias').insert({ nome: name });
    }
  }

  // Pegar categorias com id
  const { data: categoriasData } = await supabase.from('pecas_categorias').select('*');
  const catMap = {};
  categoriasData.forEach(c => catMap[c.nome.toLowerCase()] = c.id);

  console.log('2. Buscando Produtos...');
  const { data: produtos } = await supabase.from('pecas_produtos').select('*');

  console.log(`Encontrados ${produtos.length} produtos. Classificando...`);
  
  for (const p of produtos) {
    const name = p.nome.toLowerCase();
    let catName = 'Acessórios'; // Default

    if (name.includes('spoiler') || name.includes('farol') || name.includes('faróis') || name.includes('limpador') || name.includes('borracha') || name.includes('emblema') || name.includes('grade')) {
      catName = 'Exterior';
    } else if (name.includes('manopla') || name.includes('bagagito') || name.includes('maçaneta') || name.includes('banco') || name.includes('painel')) {
      catName = 'Interior';
    } else if (name.includes('intake') || name.includes('mola') || name.includes('suspensão a ar') || name.includes('injeção')) {
      catName = 'Performance';
    } else if (name.includes('miniatur') || name.includes('lego')) {
      catName = 'Colecionáveis';
    } else if (name.includes('bandeja') || name.includes('pivô') || name.includes('máquina de vidro') || name.includes('terminal')) {
      catName = 'Manutenção';
    } else if (name.includes('led') || name.includes('lâmpada') || name.includes('milha')) {
      catName = 'Acessórios';
    }

    const catId = catMap[catName.toLowerCase()];
    if (catId) {
      await supabase.from('pecas_produtos').update({ categoria_id: catId }).eq('id', p.id);
      console.log(`- ${p.nome} -> ${catName}`);
    }
  }

  console.log('Pronto!');
}

run();
