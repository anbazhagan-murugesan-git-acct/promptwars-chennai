import { NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware
 * 
 * Executes at the edge before every request reaches the application.
 * Implements performance caching headers and security hardening at the network layer.
 * This is a Google Cloud Run best practice for optimized response times.
 */
export function middleware(request) {
  const response = NextResponse.next();

  // Efficiency: Set aggressive caching for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Efficiency: Cache API responses for short duration to reduce redundant calls
  if (request.nextUrl.pathname.startsWith('/api/analytics')) {
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
  }

  // Security: Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Security: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Security: Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Security: Enforce HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Security: Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Security: Permissions policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

/**
 * Matcher configuration: Apply middleware to all routes except static files.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
