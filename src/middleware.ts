// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin routes require admin role
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to allow the request to proceed to the middleware function above.
      // If false, the user is redirected to the signIn page automatically.
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // These paths are always public
        if (
          pathname === '/' ||
          pathname.startsWith('/shop') ||
          pathname.startsWith('/product') ||
          pathname.startsWith('/about') ||
          pathname.startsWith('/contact') ||
          pathname.startsWith('/shipping') ||
          pathname.startsWith('/returns') ||
          pathname.startsWith('/privacy') ||
          pathname.startsWith('/api/products') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/payment')
        ) {
          return true;
        }

        // All other matched routes require a token
        return !!token;
      },
    },
  }
);

export const config = {
  // Only run middleware on these paths
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/favourites',
    '/account',
    '/cart',
  ],
};
