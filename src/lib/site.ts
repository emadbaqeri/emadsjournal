export const SITE_TITLE = 'emad/journal';
export const SITE_TAGLINE = 'emad/journal — a notebook, written in public';
export const GITHUB_URL = 'https://github.com/emadbaqeri';
export const CONTACT_EMAIL = 'contact@emaaad.com';

export const PRIMARY_NAV = [
  { href: '/posts', label: 'posts' },
  { href: '/series', label: 'series' },
  { href: '/about', label: 'about' },
  { href: '/rss.xml', label: 'rss' },
] as const;

export function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
