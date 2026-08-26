-- Tabela de Curtidas (Likes)
CREATE TABLE IF NOT EXISTS public.mk3_likes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.mk3_users(id) ON DELETE CASCADE,
    item_type text NOT NULL CHECK (item_type IN ('post', 'car')),
    item_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

-- Tabela de Comentários
CREATE TABLE IF NOT EXISTS public.mk3_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.mk3_users(id) ON DELETE CASCADE,
    item_type text NOT NULL CHECK (item_type IN ('post', 'car')),
    item_id text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para ambas as tabelas
ALTER TABLE public.mk3_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mk3_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para mk3_likes
CREATE POLICY "Qualquer pessoa pode ler likes"
    ON public.mk3_likes FOR SELECT
    USING (true);

CREATE POLICY "Usuários autenticados podem dar like"
    ON public.mk3_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover seu próprio like"
    ON public.mk3_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para mk3_comments
CREATE POLICY "Qualquer pessoa pode ler comentários"
    ON public.mk3_comments FOR SELECT
    USING (true);

CREATE POLICY "Usuários autenticados podem comentar"
    ON public.mk3_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios comentários"
    ON public.mk3_comments FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios comentários"
    ON public.mk3_comments FOR UPDATE
    USING (auth.uid() = user_id);
