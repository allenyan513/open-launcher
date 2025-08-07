import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import {ProductLaunchesPage} from "@/modules/products/products-launches-page";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'FF2050.AI - Find your next AI tool',
  description:
    'Discover the best AI tools and websites. Explore categories, latest products, and top-rated AI solutions. Stay updated with the latest in AI technology.',
};

export default async function Page(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  return <ProductLaunchesPage lang={lang}/>
}
