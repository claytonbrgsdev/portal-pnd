# 🔐 Sistema de Autenticação - Portal PND

Sistema completo de autenticação implementado com Supabase, incluindo login, registro, proteção de rotas e controle de acesso por roles.

## ✅ O que foi implementado:

### 1. **Context de Autenticação** (`src/contexts/AuthContext.tsx`)
- Hook `useAuth()` para gerenciar estado global de autenticação
- Funções: `signUp()`, `signIn()`, `signOut()`
- Gerenciamento automático de perfis de usuário
- Detecção de roles (user/admin)

### 2. **Componentes de UI Atualizados**
- **AuthModal**: Formulários de login/registro com validação e feedback
- **Navbar**: Menu de usuário dinâmico, mostra avatar e opções quando logado

### 3. **Proteção de Rotas**
- **ProtectedRoute**: Componente para proteger páginas
- **Middleware**: Verificação server-side de autenticação
- Redirecionamento automático baseado em permissões

### 4. **Páginas Protegidas**
- **Dashboard** (`/dashboard`): Área do usuário logado
- **Admin** (`/admin`): Área restrita para administradores

### 5. **Configuração do Banco**
- Script SQL para criar tabela `profiles`
- Row Level Security (RLS) configurado
- Triggers automáticos para novos usuários

## 🚀 Como usar:

### 1. Configure o Supabase
```bash
# 1. Crie seu projeto no Supabase
# 2. Execute o script database/auth-setup.sql no SQL Editor
# 3. Configure as variáveis de ambiente (veja ENV_SETUP.md)
```

### 2. Execute o projeto
```bash
pnpm install --frozen-lockfile
pnpm dev
```

### 3. Teste o fluxo
1. **Registro**: Clique em "Cadastrar" na navbar
2. **Login**: Faça login com email/senha
3. **Dashboard**: Acesse `/dashboard` (protegida)
4. **Admin**: Crie um admin no banco e acesse `/admin`

## 🔧 Estrutura dos arquivos:

```
src/
├── contexts/AuthContext.tsx          # Contexto global de auth
├── components/
│   ├── AuthModal.tsx                 # Modal de login/registro
│   ├── ProtectedRoute.tsx           # Proteção de componentes
│   └── Navbar.tsx                   # Navbar com menu de usuário
├── app/
│   ├── layout.tsx                   # Provider de auth
│   ├── dashboard/page.tsx           # Página do usuário
│   └── admin/page.tsx               # Página do admin
└── lib/supabase.ts                  # Cliente Supabase

middleware.ts                         # Middleware de proteção
database/
├── auth-setup.sql                   # Script de configuração
└── init-test-tables.sql            # Tabelas de teste
```

## 🛡️ Funcionalidades de Segurança:

### Autenticação
- ✅ Email/senha via Supabase Auth
- ✅ Sessões persistentes com cookies
- ✅ Verificação de email obrigatória

### Autorização
- ✅ Roles: `user` e `admin`
- ✅ RLS (Row Level Security)
- ✅ Middleware server-side
- ✅ Proteção client-side

### UX/UI
- ✅ Loading states
- ✅ Error handling
- ✅ Feedback visual
- ✅ Responsive design

## 🔄 Fluxo de Autenticação:

```
1. Usuário clica "Cadastrar" → AuthModal abre
2. Preenche dados → signUp() no AuthContext
3. Supabase cria usuário → Trigger cria profile
4. Email de confirmação enviado
5. Após confirmação → Login automático
6. AuthContext atualiza estado global
7. Navbar mostra menu do usuário
8. Rotas protegidas liberadas
```

## 🎯 Próximos passos sugeridos:

1. **Recuperação de senha**
2. **Verificação de email por SMS**
3. **OAuth (Google, GitHub)**
4. **Perfil de usuário editável**
5. **Sistema de permissões granular**

## 🐛 Troubleshooting:

### Erro "Missing Supabase environment variables"
- Verifique se `.env.local` existe com as variáveis corretas

### Usuário não consegue fazer login
- Confirme que o email foi verificado no Supabase Dashboard

### Admin não tem acesso
- Execute o script SQL para promover usuário a admin

### Páginas não protegem
- Verifique se middleware está configurado corretamente

## 📞 Suporte:

O sistema está completamente funcional e pronto para uso! Para dúvidas:
1. Verifique os logs do console
2. Confirme configuração do Supabase
3. Teste as variáveis de ambiente
