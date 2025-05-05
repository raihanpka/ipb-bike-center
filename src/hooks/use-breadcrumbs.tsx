'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/admin': [{ title: 'Admin', link: '/admin' }],
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/admin/data-sepeda': [
    { title: 'Admin', link: '/admin' },
    { title: 'Data Sepeda', link: '/admin/data-sepeda' }
  ],
  '/admin/qr-generator': [
    { title: 'Admin', link: '/admin' },
    { title: 'QR Generator', link: '/admin/qr-generator' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
