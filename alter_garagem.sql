-- Adicionar coluna de instagram na tabela mk3_garagem
ALTER TABLE public.mk3_garagem ADD COLUMN IF NOT EXISTS instagram_url text;
