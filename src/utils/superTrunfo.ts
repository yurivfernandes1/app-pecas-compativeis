export interface SuperTrunfoPoints {
  motor: number;
  suspensao: number;
  pecas: number;
  opcionais: number;
  rodas: number;
  versao: number;
  placa_preta: number;
  total: number;
}

export const formatPoints = (val: any): string => {
  if (val === undefined || val === null || val === '') return '0,00';
  const num = Number(val);
  if (isNaN(num)) return '0,00';
  return num.toFixed(2).replace('.', ',');
};

export const getFaixaTalaLabel = (tala: number): string => {
  if (tala <= -30) return '-40 a -30';
  if (tala <= -20) return '-30 a -20';
  if (tala <= -10) return '-20 a -10';
  if (tala <= 0) return '-10 a 0';
  if (tala <= 10) return '0 a 10';
  if (tala <= 20) return '10 a 20';
  if (tala <= 30) return '20 a 30';
  if (tala <= 40) return '30 a 40';
  if (tala <= 50) return '40 a 50';
  if (tala <= 60) return '50 a 60';
  if (tala <= 70) return '60 a 70';
  return '70 a 80';
};

export function calculateSuperTrunfoPoints(carro: any, tags: any[]): SuperTrunfoPoints {
  const pointsFor = (items: string[] | undefined, tipo: string) => (items || []).reduce((sum, item) => {
    if (!item) return sum;
    const tag = tags.find(candidate => candidate.tipo === tipo && candidate.nome.toLowerCase() === String(item).trim().toLowerCase());
    return sum + (Number(tag?.pontuacao) || 0);
  }, 0);

  const motor = pointsFor(carro.modificacoes_motor, 'mod_motor');
  
  // Suspensão: Pontos por Tipo + Pontos por Marca vindos do banco de dados
  const pTipo = carro.tipo_suspensao ? pointsFor([carro.tipo_suspensao], 'tipo_suspensao') : 0;
  const pMarca = carro.marca_suspensao ? pointsFor([carro.marca_suspensao], 'marca_suspensao') : 0;
  let suspensao = pTipo + pMarca;
  if (suspensao === 0 && carro.tipo_suspensao && !['Original', 'Nenhuma'].includes(carro.tipo_suspensao)) {
    suspensao = 20;
  }

  const pecas = pointsFor(carro.pecas_raras, 'peca_rara');
  const opcionais = pointsFor(carro.opcionais, 'opcional');

  // Rodas: Pontos por Modelo + Pontos por Faixa de Tala vindos do banco de dados
  const pRoda = carro.modelo_roda && carro.modelo_roda !== 'Outros' ? pointsFor([carro.modelo_roda], 'roda') : 0;
  let pTala = 0;
  if (carro.tala_roda !== undefined && carro.tala_roda !== null && String(carro.tala_roda).trim() !== '') {
    const faixaLabel = getFaixaTalaLabel(Number(carro.tala_roda));
    const tagTala = tags.find(t => t.tipo === 'faixa_tala' && t.nome === faixaLabel);
    pTala = Number(tagTala?.pontuacao) || 0;
  }
  const rodas = pRoda + pTala;

  // Versão do Carro: pontuação por raridade configurada no banco
  let versao = 0;
  if (carro.modelo) {
    const tagVersao = tags.find(t => t.tipo === 'versao_carro' && t.nome.toLowerCase() === String(carro.modelo).trim().toLowerCase());
    if (tagVersao) {
      versao = Number(tagVersao.pontuacao) || 0;
    } else {
      // Fallback padrão se ainda não cadastrado no banco
      const defaultVersoes: Record<string, number> = {
        'cabrio': 60,
        'vr6': 50,
        'gti': 40,
        'gt': 30,
        'glx': 25,
        'highline': 20,
        'tdi': 20,
        'gl': 15,
        'cl': 10,
        'outro': 5
      };
      versao = defaultVersoes[String(carro.modelo).trim().toLowerCase()] || 0;
    }
  }

  // Flag de Placa Preta / Colecionador
  let placa_preta = 0;
  if (carro.placa_preta === true || carro.placa_preta === 'true' || carro.placa_preta === 1) {
    const tagPlaca = tags.find(t => t.tipo === 'placa_preta');
    placa_preta = tagPlaca ? (Number(tagPlaca.pontuacao) || 0) : 50;
  }

  const r2 = (v: number) => Math.round(v * 100) / 100;
  return { 
    motor: r2(motor), 
    suspensao: r2(suspensao), 
    pecas: r2(pecas), 
    opcionais: r2(opcionais), 
    rodas: r2(rodas), 
    versao: r2(versao),
    placa_preta: r2(placa_preta),
    total: r2(motor + suspensao + pecas + opcionais + rodas + versao + placa_preta) 
  };
}