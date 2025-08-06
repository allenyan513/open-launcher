import type {MetadataRoute} from 'next'
import {i18n} from "@/config/i18n-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result: any[] = []
  for (const lang of i18n.locales) {
    result.push({
      url: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${lang}/products/sitemap/${lang}.xml`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    })

    result.push({
      url: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${lang}/category/sitemap/${lang}.xml`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    })
  }

  return [
    {
      url: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...result,
  ]
}
