import { createClient } from '@/utils/supabase/route';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware triggered for:', request.nextUrl.pathname);

  // Skip middleware for static exports to avoid conflicts
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export') {
    console.log('🔍 Skipping middleware for static export');
    return NextResponse.next();
  }

  try {
    // Create a Supabase client configured to use cookies
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔍 Session exists:', !!session, session?.user?.email);

    // Protected routes that require authentication
    const protectedRoutes = ['/admin', '/dashboard'];
    const adminRoutes = ['/admin'];

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    console.log('🔍 Route check:', {
      pathname,
      isProtectedRoute,
      isAdminRoute,
      sessionUserId: session?.user?.id
    });

    if (isProtectedRoute) {
      // If no session and trying to access protected route
      if (!session) {
        console.log('🔍 No session, redirecting to login');
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      // If admin route, check if user is admin
      if (isAdminRoute) {
        try {
          console.log('🔍 Checking admin status for user:', session.user.id);

          // Check if user has admin role in JWT metadata
          const isAdminFromJWT = session.user.user_metadata?.user_role === 'admin';

          console.log('🔍 Admin check:', {
            jwtRole: session.user.user_metadata?.user_role,
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
          // If can't verify admin status, redirect to dashboard
          const redirectUrl = new URL('/dashboard', request.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error with auth check, allow the request to continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
