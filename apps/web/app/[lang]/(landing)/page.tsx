import {ProductLaunchesPage} from "@/modules/products/products-launches-page";
import type {Metadata} from "next";
import {i18n} from "@/config/i18n-config";

export const metadata: Metadata = {
  title: 'FF2050.AI - Find your next AI tool',
  description:
    'Discover the best AI tools and websites. Explore categories, latest products, and top-rated AI solutions. Stay updated with the latest in AI technology.',
};
export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_SSG === 'true') {
    return []
  }
  return i18n.locales.map((lang) => {
    return {
      lang: lang
    }
  })
}
export default async function Page(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  return <ProductLaunchesPage lang={lang}/>
}
