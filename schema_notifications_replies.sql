-- 1. Adicionar suporte a respostas nos comentários (parent_id)
ALTER TABLE public.mk3_comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.mk3_comments(id) ON DELETE CASCADE;

-- 2. Criar a tabela de Notificações
CREATE TABLE IF NOT EXISTS public.mk3_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.mk3_users(id) ON DELETE CASCADE NOT NULL, -- Quem recebe a notificação
    actor_id uuid REFERENCES public.mk3_users(id) ON DELETE CASCADE NOT NULL, -- Quem executou a ação
    type text NOT NULL CHECK (type IN ('like', 'comment', 'reply')),
    item_type text NOT NULL CHECK (item_type IN ('post', 'car', 'comment')),
    item_id text NOT NULL, -- ID do post, carro ou comentário dependendo do tipo
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS nas Notificações
ALTER TABLE public.mk3_notifications ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas para Notificações
CREATE POLICY "Usuários podem ver suas próprias notificações"
    ON public.mk3_notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem inserir notificações"
    ON public.mk3_notifications FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar (marcar como lido) suas próprias notificações"
    ON public.mk3_notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias notificações"
    ON public.mk3_notifications FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Recarregar o cache do schema (muito importante!)
NOTIFY pgrst, 'reload schema';
