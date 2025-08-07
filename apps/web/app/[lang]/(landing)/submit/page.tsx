import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import {ProductLaunchesPage} from "@/modules/products/products-launches-page";
import type {Metadata} from "next";
import {ProductSubmitSEOPage} from "@/modules/products/products-submit-seo-page";

export const metadata: Metadata = {
  title: 'Free Submit your AI tools - FF2050.AI',
  description:
    'Submit your AI tools for free on FF2050.AI. Get featured in our AI tools directory and reach a wider audience. Join the best AI community today!',
};

export default async function Page(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  return <ProductSubmitSEOPage lang={lang}/>
}
