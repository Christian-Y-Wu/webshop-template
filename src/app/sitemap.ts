import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';
import { products } from '@/lib/data/products';
import { collections } from '@/lib/data/collections';
import { blogPosts } from '@/lib/data/blog';
import { contentPages } from '@/lib/data/pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const now = new Date();

  const staticRoutes = ['', '/collections', '/blog', '/pages/contact', '/pages/faq'].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${base}/collections/${c.handle}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const blogRoutes = blogPosts.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const pageRoutes = contentPages.map((p) => ({
    url: `${base}/pages/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...blogRoutes, ...pageRoutes];
}
