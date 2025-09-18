-- Criar enum para status dos títulos
CREATE TYPE public.status_titulo AS ENUM ('pendente', 'pago', 'vencido', 'cancelado');

-- Criar enum para formas de pagamento
CREATE TYPE public.forma_pagamento AS ENUM ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia', 'boleto', 'outros');

-- Tabela de títulos de cobrança
CREATE TABLE public.titulos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_titulo TEXT NOT NULL UNIQUE,
    cliente_nome TEXT NOT NULL,
    cliente_documento TEXT,
    cliente_email TEXT,
    cliente_telefone TEXT,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
    status status_titulo NOT NULL DEFAULT 'pendente',
    descricao TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de baixas (pagamentos)
CREATE TABLE public.baixas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo_id UUID NOT NULL REFERENCES public.titulos(id) ON DELETE CASCADE,
    valor_pago DECIMAL(10,2) NOT NULL,
    data_pagamento DATE NOT NULL,
    forma_pagamento forma_pagamento NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.titulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baixas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para títulos (permitir acesso público por enquanto)
CREATE POLICY "Permitir acesso completo aos títulos" 
ON public.titulos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Políticas RLS para baixas (permitir acesso público por enquanto)
CREATE POLICY "Permitir acesso completo às baixas" 
ON public.baixas 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para atualizar updated_at na tabela títulos
CREATE TRIGGER update_titulos_updated_at
    BEFORE UPDATE ON public.titulos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_titulos_numero ON public.titulos(numero_titulo);
CREATE INDEX idx_titulos_vencimento ON public.titulos(data_vencimento);
CREATE INDEX idx_titulos_status ON public.titulos(status);
CREATE INDEX idx_baixas_titulo_id ON public.baixas(titulo_id);
CREATE INDEX idx_baixas_data_pagamento ON public.baixas(data_pagamento);