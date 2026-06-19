import type { MetadataRoute } from 'next'

const BASE_URL = 'https://fractus.fractionalaeco.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/profile', '/admin', '/api', '/forgot-password', '/reset-password', '/verify-email'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
