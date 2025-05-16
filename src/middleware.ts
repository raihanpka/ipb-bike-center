import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Tambahkan logika untuk maintenance
const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

export default clerkMiddleware(async (auth, req) => {
  // Cek apakah aplikasi dalam mode maintenance
  if (isMaintenance) {
    // Allow access to the maintenance page itself to avoid redirect loop
    if (req.nextUrl.pathname === '/maintenance') {
      return NextResponse.next();
    }
    const maintenanceUrl = new URL('/maintenance', req.url);
    return NextResponse.redirect(maintenanceUrl);
  } else if (isMaintenance == false) {
    // Cek apakah user mengakses rute admin
    if (
      isAdminRoute(req) &&
      (await auth()).sessionClaims?.metadata?.role !== 'admin'
    ) {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }

    // Cek apakah user mengakses rute yang dilindungi
    if (isProtectedRoute(req)) await auth.protect();

    // Lanjutkan ke rute berikutnya dengan token Supabase
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
