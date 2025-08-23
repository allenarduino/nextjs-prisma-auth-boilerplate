import { auth } from '@/lib/auth';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Public routes
    const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/forgot-password', '/reset-password'];
    if (publicRoutes.includes(pathname)) {
        // Redirect authenticated users away from auth pages to dashboard
        if (isLoggedIn && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
            return Response.redirect(new URL('/dashboard', req.url));
        }
        return;
    }

    // Protected routes
    if (!isLoggedIn && pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/auth/signin', req.url));
    }

    // Admin routes
    if (pathname.startsWith('/admin')) {
        if (!isLoggedIn || req.auth?.user?.role !== 'ADMIN') {
            return Response.redirect(new URL('/auth/signin', req.url));
        }
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
