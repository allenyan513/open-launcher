import type {MetadataRoute} from 'next'
import {i18n} from "@/config/i18n-config";
import {api} from "@repo/shared";

export async function generateSitemaps() {
  return i18n.locales.map((lang) => {
    return {
      id: lang,
    }
  })
}

export default async function sitemap(props: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  const result: any[] = []
  const allSlugs = await api.productCategories.findAllSlug()
  // const allSlugs: string[] = []
  for (const slug of allSlugs) {
    result.push({
      url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${props.id}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }
  return [
    ...result,
  ]
}
