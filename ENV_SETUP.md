# Configuração das Variáveis de Ambiente

Para configurar a autenticação com Supabase, você precisa criar um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
DATABASE_URL=postgresql://postgres.seu-projeto-id:sua-senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## Como obter essas informações:

### 1. Acesse seu Dashboard do Supabase
- Vá para https://supabase.com/dashboard
- Selecione seu projeto

### 2. Configure as chaves da API
- Vá em **Settings > API**
- Copie:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **Project API keys > anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure a string de conexão do banco
- Vá em **Settings > Database**
- Na seção "Connection string", selecione **"Transaction Pooler"**
- Copie a string e substitua `[YOUR-PASSWORD]` pela senha real do banco
- Use essa string como `DATABASE_URL`

## Configuração do Banco de Dados

Após configurar as variáveis de ambiente, execute o script SQL em `database/auth-setup.sql` no SQL Editor do Supabase para:

1. Criar a tabela `profiles`
2. Configurar Row Level Security (RLS)
3. Criar triggers automáticos para novos usuários
4. Configurar políticas de segurança

## Criando seu primeiro admin

No script `auth-setup.sql`, descomente e ajuste as linhas finais para criar seu primeiro usuário admin:

```sql
INSERT INTO profiles (id, email, name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com' LIMIT 1),
  'seu-email@exemplo.com',
  'Administrador',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Segurança

⚠️ **Importante:**
- Nunca commite o arquivo `.env.local` no Git
- As chaves `NEXT_PUBLIC_*` são expostas no frontend
- Mantenha `DATABASE_URL` em segredo
- Em produção, use as variáveis de ambiente do seu provedor de hospedagem
