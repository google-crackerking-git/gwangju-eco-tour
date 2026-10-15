import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/my'],
      },
    ],
    sitemap: 'https://ecotour.gwangju.kr/sitemap.xml',
  };
}
