import { NAVIGATION_CONFIG } from '@/config/navigation';
import { BreadcrumbItem } from '@/types/common';

/**
 * Derives a structured breadcrumb trail from a route pathname using navigation config.
 */
export function getBreadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  if (!pathname || pathname === '/' || pathname === '/dashboard') {
    return [{ label: 'Dashboard', href: '/dashboard' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

  for (const item of NAVIGATION_CONFIG) {
    // Exact match for top-level item with path
    if (item.path && item.path === pathname) {
      if (item.path !== '/dashboard') {
        breadcrumbs.push({ label: item.label, href: item.path });
      }
      return breadcrumbs;
    }

    // Check nested children
    if (item.children) {
      for (const child of item.children) {
        if (child.path && (pathname === child.path || pathname.startsWith(`${child.path}/`))) {
          breadcrumbs.push({ label: item.label });
          breadcrumbs.push({ label: child.label, href: child.path });
          return breadcrumbs;
        }
      }
    }
  }

  // Fallback if route is not in navigation config: generate from path segments
  const segments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  segments.forEach((seg, idx) => {
    currentPath += `/${seg}`;
    if (currentPath === '/dashboard') return;

    const formattedLabel = seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbs.push({
      label: formattedLabel,
      href: idx === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
