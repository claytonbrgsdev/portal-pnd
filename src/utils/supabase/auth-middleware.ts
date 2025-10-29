import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Aplica lógica de autorização e proteção de rotas
 * @param request - NextRequest object
 * @param supabase - Cliente Supabase autenticado
 * @returns NextResponse com redirect se necessário, ou null para continuar
 */
export async function applyAuthorization(
  request: NextRequest,
  supabase: SupabaseClient
): Promise<NextResponse | null> {
  // Skip middleware for static exports to avoid conflicts
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export') {
    console.log('🔍 Skipping middleware for static export');
    return null;
  }

  try {
    // Verifica sessão do usuário
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔍 User exists:', !!user, user?.email);

    const { pathname } = request.nextUrl;

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = ['/admin', '/dashboard'];
    const adminRoutes = ['/admin'];

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    console.log('🔍 Route check:', {
      pathname,
      isProtectedRoute,
      isAdminRoute,
      sessionUserId: user?.id
    });

    if (isProtectedRoute) {
      // Se não há sessão e tentando acessar rota protegida
      if (!user) {
        console.log('🔍 No session, redirecting to login');
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      // Se é rota de admin, verifica se usuário é admin
      if (isAdminRoute) {
        try {
          console.log('🔍 Checking admin status for user:', user.id);

          // Verifica se usuário tem role admin no JWT metadata
          const isAdminFromJWT = user.user_metadata?.user_role === 'admin';

          console.log('🔍 Admin check:', {
            jwtRole: user.user_metadata?.user_role,
            isAdminFromJWT
          });

          if (!isAdminFromJWT) {
            console.log('🔍 User is not admin, redirecting to dashboard');
            const redirectUrl = new URL('/dashboard', request.url);
            return NextResponse.redirect(redirectUrl);
          } else {
            console.log('🔍 User is admin, allowing access');
          }
        } catch (error) {
          console.error('🔍 Error checking admin role:', error);
          // Se não consegue verificar status admin, redireciona para dashboard
          const redirectUrl = new URL('/dashboard', request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // Se passou por todas as verificações, retorna null para continuar
    return null;
  } catch (error) {
    console.error('Middleware error:', error);
    // Se há erro na verificação de auth, permite que a requisição continue
    return null;
  }
}
