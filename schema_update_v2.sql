-- Atualizar a tabela mk3_garagem para o novo sistema de Ano

-- 1. Renomear a coluna atual 'ano' para 'ano_fabricacao'
ALTER TABLE public.mk3_garagem RENAME COLUMN ano TO ano_fabricacao;

-- 2. Criar a nova coluna 'ano_modelo'
ALTER TABLE public.mk3_garagem ADD COLUMN IF NOT EXISTS ano_modelo text;

-- 3. Recarregar o schema do Supabase para garantir que a API reconheça a nova coluna
NOTIFY pgrst, 'reload schema';
