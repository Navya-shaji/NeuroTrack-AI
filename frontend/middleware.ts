import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Allow Google OAuth popup to communicate with the main window
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  return res;
}

export const config = {
  // Apply to all routes (including API routes)
  matcher: '/:path*',
};
